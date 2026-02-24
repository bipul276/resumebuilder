import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { pdfRouter } from './routes/pdf.routes.js';
import authRouter from './routes/auth.routes.js';
import paymentRouter from './routes/payment.routes.js';
import aiRouter from './routes/ai.routes.js';
import analyticsRouter from './routes/analytics.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts, please try again later.' },
});

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Resume Builder API is running',
        clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
        endpoints: {
            health: '/health',
            pdf: '/api/generate-pdf',
            auth: '/api/auth',
            payment: '/api/payment'
        }
    });
});

// Routes
app.use('/api', pdfRouter);
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Resume Builder API running on http://localhost:${PORT}`);
        console.log(`📄 PDF endpoint: POST http://localhost:${PORT}/api/generate-pdf`);
        console.log(`🔐 Auth endpoints: /api/auth/register, /api/auth/login, /api/auth/me`);
        console.log(`💳 Payment endpoints: /api/payment/create-order, /api/payment/verify`);
    });
}

export { app };

