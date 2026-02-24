import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from './auth.routes.js';

const router = express.Router();

// Track an event
router.post('/track', authenticateToken, async (req, res) => {
    try {
        const { event_type, metadata } = req.body;
        // @ts-ignore
        const userId = (req as any).userId;

        await query(
            'INSERT INTO resume_analytics (user_id, event_type, metadata) VALUES ($1, $2, $3)',
            [userId, event_type, metadata || {}]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Analytics Track Error:', error);
        res.status(500).json({
            error: 'Failed to track event',
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// Get user stats
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId || (req as any).userId;

        // Verify tier
        const userResult = await query('SELECT tier FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0 || userResult.rows[0].tier !== 'pro_plus') {
            return res.status(403).json({ error: 'Analytics dashboard is available on Pro+ plan only' });
        }

        // Get total counts by event type
        const statsResult = await query(
            `SELECT event_type, COUNT(*) as count 
             FROM resume_analytics 
             WHERE user_id = $1 
             GROUP BY event_type`,
            [userId]
        );

        // Get activity over time (last 7 days)
        const timelineResult = await query(
            `SELECT DATE(created_at) as date, event_type, COUNT(*) as count 
             FROM resume_analytics 
             WHERE user_id = $1 AND created_at > NOW() - INTERVAL '7 days'
             GROUP BY DATE(created_at), event_type
             ORDER BY DATE(created_at)`,
            [userId]
        );

        const stats = statsResult.rows.reduce((acc: any, row: any) => {
            acc[row.event_type] = parseInt(row.count);
            return acc;
        }, {});

        res.json({
            summary: {
                views: stats.view || 0,
                downloads: stats.download || 0,
                copies: stats.copy || 0
            },
            timeline: timelineResult.rows
        });
    } catch (error) {
        console.error('Analytics Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

export default router;
