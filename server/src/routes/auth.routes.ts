import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';
import dotenv from 'dotenv';

dotenv.config();

const authRouter = Router();
const _jwtSecret = process.env.JWT_SECRET;
if (!_jwtSecret) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start without it.');
}
const JWT_SECRET: string = _jwtSecret;

// Types
interface User {
    id: number;
    email: string;
    name: string | null;
    tier: 'free' | 'pro' | 'pro_plus';
    tier_expiry: Date | null;
}

// Middleware to verify JWT
export async function authenticateToken(req: Request, res: Response, next: Function) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        (req as any).userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

// POST /api/auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user
        const result = await query<User>(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, tier, tier_expiry',
            [email, passwordHash, name || null]
        );

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tier: user.tier,
            },
            token,
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const result = await query<User & { password_hash: string }>(
            'SELECT id, email, name, tier, tier_expiry, password_hash FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tier: user.tier,
                tierExpiry: user.tier_expiry,
            },
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/auth/me - Get current user
authRouter.get('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const result = await query<User>(
            'SELECT id, email, name, tier, tier_expiry FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tier: user.tier,
                tierExpiry: user.tier_expiry,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// POST /api/auth/forgot-password
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if user exists
        const userResult = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            // Don't reveal user existence
            return res.json({ message: 'If an account exists, an OTP will be sent.' });
        }

        const userId = userResult.rows[0].id;

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP
        await query(
            'INSERT INTO password_resets (user_id, otp, expires_at) VALUES ($1, $2, $3)',
            [userId, otp, expiresAt]
        );

        // Send Email
        try {
            const { sendOTPEmail } = await import('../utils/email.js');
            await sendOTPEmail(email, otp);
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            return res.status(500).json({ error: 'Failed to send OTP email' });
        }

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/verify-otp (Optional step if valid UI needs it, but we can do it in reset)

// POST /api/auth/reset-password
authRouter.post('/reset-password', async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: 'Email, OTP, and new password are required' });
        }

        // Verify OTP
        const otpResult = await query(
            `SELECT pr.id, pr.user_id, pr.expires_at 
             FROM password_resets pr
             JOIN users u ON pr.user_id = u.id
             WHERE u.email = $1 AND pr.otp = $2 AND pr.used = FALSE
             ORDER BY pr.created_at DESC LIMIT 1`,
            [email, otp]
        );

        if (otpResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const resetRecord = otpResult.rows[0];

        // Check expiry
        if (new Date() > new Date(resetRecord.expires_at)) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, resetRecord.user_id]);

        // Mark OTP as used
        await query('UPDATE password_resets SET used = TRUE WHERE id = $1', [resetRecord.id]);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});


export default authRouter;
