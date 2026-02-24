import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

// Mock Razorpay
const { mockRazorpayInstance } = vi.hoisted(() => {
    return {
        mockRazorpayInstance: {
            payments: {
                fetch: vi.fn(),
            },
        },
    };
});

vi.mock('razorpay', () => {
    return {
        default: vi.fn(() => mockRazorpayInstance),
    };
});

// Mock DB query
// We need to mock the db module to prevent actual DB calls
vi.mock('../db/index.js', () => ({
    query: vi.fn(),
    pool: {
        end: vi.fn(),
    }
}));

// Mock authentication middleware
// Since we are testing the route logic, we can assume auth is working or mock it to bypass
vi.mock('./auth.routes.js', async () => {
    const original = await vi.importActual('./auth.routes.js');
    return {
        ...original,
        authenticateToken: (req, res, next) => {
            req.userId = 1; // Mock user ID
            next();
        },
    };
});

describe('POST /api/payment/verify-payment', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should verify payment successfully for Pro plan', async () => {
        // Mock successful Razorpay fetch
        mockRazorpayInstance.payments.fetch.mockResolvedValue({
            status: 'captured',
            amount: 29900, // ₹299
        });

        const res = await request(app)
            .post('/api/payment/verify-payment')
            .send({
                payment_id: 'pay_1234567890',
                plan_type: 'pro',
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.tier).toBe('pro');
        expect(mockRazorpayInstance.payments.fetch).toHaveBeenCalledWith('pay_1234567890');
    });

    it('should verify payment successfully for Pro+ plan', async () => {
        mockRazorpayInstance.payments.fetch.mockResolvedValue({
            status: 'captured',
            amount: 49900, // ₹499
        });

        const res = await request(app)
            .post('/api/payment/verify-payment')
            .send({
                payment_id: 'pay_9876543210',
                plan_type: 'pro_plus',
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.tier).toBe('pro_plus');
    });

    it('should fail if payment is not captured', async () => {
        mockRazorpayInstance.payments.fetch.mockResolvedValue({
            status: 'failed',
            amount: 29900,
        });

        const res = await request(app)
            .post('/api/payment/verify-payment')
            .send({
                payment_id: 'pay_failed',
                plan_type: 'pro',
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('Payment not successful');
    });

    it('should fail if amount does not match plan price', async () => {
        mockRazorpayInstance.payments.fetch.mockResolvedValue({
            status: 'captured',
            amount: 10000, // ₹100, but plan costs ₹299
        });

        const res = await request(app)
            .post('/api/payment/verify-payment')
            .send({
                payment_id: 'pay_wrong_amount',
                plan_type: 'pro',
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('Amount mismatch');
    });

    it('should fail with invalid plan type', async () => {
        mockRazorpayInstance.payments.fetch.mockResolvedValue({
            status: 'captured',
            amount: 29900,
        });

        const res = await request(app)
            .post('/api/payment/verify-payment')
            .send({
                payment_id: 'pay_valid',
                plan_type: 'invalid_plan',
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('Invalid plan type');
    });
});
