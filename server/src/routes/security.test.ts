import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { pdfRouter } from './pdf.routes';
import aiRouter from './ai.routes';
import analyticsRouter from './analytics.routes';

// Mock dependencies
const mocks = vi.hoisted(() => ({
    authenticateToken: vi.fn(),
    query: vi.fn(),
    generateSandboxPDF: vi.fn(),
    GoogleGenerativeAI: vi.fn(),
}));

// Mock modules
vi.mock('./auth.routes', () => ({
    authenticateToken: mocks.authenticateToken,
}));

vi.mock('../db/index', () => ({
    query: mocks.query,
}));

vi.mock('../services/pdf-generator', () => ({
    generateSandboxPDF: mocks.generateSandboxPDF,
    generatePDF: vi.fn(),
    generatePreview: vi.fn(),
}));

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: mocks.GoogleGenerativeAI,
}));

const app = express();
app.use(express.json());
app.use('/api', pdfRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);

describe('Security Verification', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default auth mock: valid user
        mocks.authenticateToken.mockImplementation((req, res, next) => {
            req.user = { userId: 1 };
            next();
        });
        mocks.generateSandboxPDF.mockResolvedValue(Buffer.from('pdf'));
    });

    describe('PDF Route Security', () => {
        it('should force watermark for free users even if isPro=true sent', async () => {
            // Mock free user
            mocks.query.mockResolvedValue({ rows: [{ tier: 'free' }] });

            await request(app)
                .post('/api/generate-sandbox-pdf')
                .send({
                    elements: ['test'],
                    isPro: true, // Maliciously sending true
                    customWatermark: 'My Custom Watermark',
                    watermarkStyle: 'corner'
                });

            expect(mocks.generateSandboxPDF).toHaveBeenCalledWith(
                expect.objectContaining({ elements: ['test'] }),
                false, // canRemoveWatermark should be false
                undefined, // customWatermark should be undefined
                'tiled' // watermarkStyle should be forced to tiled (default)
            );
        });

        it('should allow watermark removal for pro users', async () => {
            // Mock pro user
            mocks.query.mockResolvedValue({ rows: [{ tier: 'pro' }] });

            await request(app)
                .post('/api/generate-sandbox-pdf')
                .send({
                    elements: ['test'],
                    isPro: true
                });

            expect(mocks.generateSandboxPDF).toHaveBeenCalledWith(
                expect.anything(),
                true, // canRemoveWatermark
                undefined,
                'tiled'
            );
        });

        it('should verify custom watermark for pro_plus users', async () => {
            // Mock pro_plus user
            mocks.query.mockResolvedValue({ rows: [{ tier: 'pro_plus' }] });

            await request(app)
                .post('/api/generate-sandbox-pdf')
                .send({
                    elements: ['test'],
                    customWatermark: 'Custom',
                    watermarkStyle: 'corner'
                });

            expect(mocks.generateSandboxPDF).toHaveBeenCalledWith(
                expect.anything(),
                true, // canRemoveWatermark
                'Custom',
                'corner'
            );
        });

        it('should deny custom watermark for pro users (only pro_plus)', async () => {
            // Mock pro user
            mocks.query.mockResolvedValue({ rows: [{ tier: 'pro' }] });

            await request(app)
                .post('/api/generate-sandbox-pdf')
                .send({
                    elements: ['test'],
                    customWatermark: 'Custom',
                    watermarkStyle: 'corner'
                });

            expect(mocks.generateSandboxPDF).toHaveBeenCalledWith(
                expect.anything(),
                true, // canRemoveWatermark (Pro can remove)
                undefined, // But cannot custom
                'tiled' // Or allow style? My code said "const validWatermarkStyle = canCustomWatermark ? watermarkStyle : 'tiled';"
            );
        });
    });

    describe('AI Route Security', () => {
        it('should block free users from /ai/improve', async () => {
            mocks.query.mockResolvedValue({ rows: [{ tier: 'free' }] });

            const res = await request(app)
                .post('/api/ai/improve')
                .send({ text: 'test' });

            expect(res.status).toBe(403);
            expect(res.body.error).toContain('Pro+ plan only');
        });

        it('should block pro users from /ai/improve', async () => {
            mocks.query.mockResolvedValue({ rows: [{ tier: 'pro' }] });

            const res = await request(app)
                .post('/api/ai/improve')
                .send({ text: 'test' });

            expect(res.status).toBe(403);
        });

        it('should allow pro_plus users to /ai/improve', async () => {
            mocks.query.mockResolvedValue({ rows: [{ tier: 'pro_plus' }] });
            // Mock AI gen
            const mockGenerate = vi.fn().mockResolvedValue({ response: { text: () => 'Improved' } });
            mocks.GoogleGenerativeAI.mockImplementation(() => ({
                getGenerativeModel: () => ({ generateContent: mockGenerate })
            }));
            process.env.GOOGLE_API_KEY = 'test';

            const res = await request(app)
                .post('/api/ai/improve')
                .send({ text: 'test' });

            // It might fail on API key or internal logic, but shouldn't be 403
            // Assuming mocks work, it might be 200 via mock
            expect(res.status).not.toBe(403);
        });
    });

    describe('Analytics Route Security', () => {
        it('should block free users from /analytics/stats', async () => {
            mocks.query.mockResolvedValue({ rows: [{ tier: 'free' }] });

            const res = await request(app).get('/api/analytics/stats');

            expect(res.status).toBe(403);
        });

        it('should allow pro_plus users to /analytics/stats', async () => {
            mocks.query.mockImplementation((sql) => {
                if (sql.includes('SELECT tier')) return { rows: [{ tier: 'pro_plus' }] };
                return { rows: [] }; // Stats query
            });

            const res = await request(app).get('/api/analytics/stats');

            expect(res.status).not.toBe(403);
        });
    });
});
