import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { query } from '../db/index.js';
import { authenticateToken } from './auth.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const paymentRouter = Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Pricing in paise (1 INR = 100 paise)
const PRICING = {
    pro: {
        monthly: 29900, // ₹299
        name: 'Pro',
    },
    pro_plus: {
        monthly: 49900, // ₹499
        name: 'Pro+',
    },
};

// POST /api/payment/verify-payment
paymentRouter.post('/verify-payment', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { payment_id, plan_type } = req.body;
        const userId = (req as any).userId;

        if (!payment_id || !plan_type) {
            return res.status(400).json({ error: 'Missing payment_id or plan_type' });
        }

        // Verify with Razorpay
        let payment;

        try {
            payment = await razorpay.payments.fetch(payment_id);
        } catch (err) {
            console.error('Razorpay fetch error:', err);
            return res.status(400).json({ error: 'Invalid payment ID' });
        }

        if (payment.status !== 'captured') {
            return res.status(400).json({ error: 'Payment not successful/captured' });
        }

        // 2. Validate Amount matches Plan
        const pricing = PRICING[plan_type as keyof typeof PRICING];
        if (!pricing) {
            return res.status(400).json({ error: 'Invalid plan type' });
        }

        // Razorpay amount is in paise
        // Allow a small buffer if needed, but usually it should be exact
        if (payment.amount !== pricing.monthly) {
            // For test bypass, we ensured strict match, but real payments might behave differently? No, they should match.
            return res.status(400).json({
                error: `Amount mismatch. Expected ${pricing.monthly}, got ${payment.amount}`
            });
        }

        // 3. Update User & Record Payment

        // Calculate tier expiry (1 month from now)
        const tierExpiry = new Date();
        tierExpiry.setMonth(tierExpiry.getMonth() + 1);

        // Update user tier
        await query(
            'UPDATE users SET tier = $1, tier_expiry = $2, updated_at = NOW() WHERE id = $3',
            [plan_type, tierExpiry, userId]
        );

        // Record payment
        await query(
            `INSERT INTO payments (user_id, razorpay_payment_id, amount, plan, status)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, payment_id, payment.amount, plan_type, 'success']
        );

        res.json({
            success: true,
            message: `Successfully upgraded to ${pricing.name}!`,
            tier: plan_type,
            tierExpiry: tierExpiry,
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

// GET /api/payment/history
paymentRouter.get('/history', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const result = await query(
            `SELECT id, razorpay_payment_id, amount, plan, status, created_at
             FROM payments WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        res.json({
            payments: result.rows.map((p) => ({
                id: p.id,
                paymentId: p.razorpay_payment_id,
                amount: p.amount / 100, // Convert paise to rupees
                plan: p.plan,
                status: p.status,
                date: p.created_at,
            })),
        });
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({ error: 'Failed to get payment history' });
    }
});

export default paymentRouter;
