import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from './auth.routes.js';

const router = express.Router();

// ============================================
// BRIDGE PHASE: Both old (authenticated) and new (anonymous) endpoints coexist.
// The old endpoint will be removed after frontend caches clear.
// ============================================

// [LEGACY] Track an event (authenticated — will be removed after transition)
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

// [NEW] Track an event anonymously using a resume UUID
router.post('/track-anon', async (req, res) => {
    try {
        const { anon_id, event_type, metadata } = req.body;

        if (!anon_id || !event_type) {
            return res.status(400).json({ error: 'anon_id and event_type are required' });
        }

        // Validate anon_id is a valid UUID format (basic check)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(anon_id)) {
            return res.status(400).json({ error: 'Invalid anon_id format' });
        }

        await query(
            'INSERT INTO resume_analytics (anon_id, event_type, metadata) VALUES ($1, $2, $3)',
            [anon_id, event_type, metadata || {}]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Anonymous Analytics Track Error:', error);
        res.status(500).json({
            error: 'Failed to track event',
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// Get user stats — supports both authenticated (legacy) and anonymous (new)
router.get('/stats', async (req, res) => {
    try {
        const anon_id = req.query.anon_id as string | undefined;
        let filterColumn: string;
        let filterValue: string | number;

        if (anon_id) {
            // New anonymous path
            filterColumn = 'anon_id';
            filterValue = anon_id;
        } else {
            // Legacy authenticated path
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'No authentication token or anon_id provided' });
            }

            // Decode token to get userId (inline to avoid full middleware)
            const jwt = await import('jsonwebtoken');
            try {
                const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
                filterColumn = 'user_id';
                filterValue = decoded.userId;
            } catch {
                return res.status(401).json({ error: 'Invalid token' });
            }

            // Verify tier for legacy path
            const userResult = await query('SELECT tier FROM users WHERE id = $1', [filterValue]);
            if (userResult.rows.length === 0 || userResult.rows[0].tier !== 'pro_plus') {
                return res.status(403).json({ error: 'Analytics dashboard is available on Pro+ plan only' });
            }
        }

        // Get total counts by event type
        const statsResult = await query(
            `SELECT event_type, COUNT(*) as count 
             FROM resume_analytics 
             WHERE ${filterColumn} = $1 
             GROUP BY event_type`,
            [filterValue]
        );

        // Get activity over time (last 7 days)
        const timelineResult = await query(
            `SELECT DATE(created_at) as date, event_type, COUNT(*) as count 
             FROM resume_analytics 
             WHERE ${filterColumn} = $1 AND created_at > NOW() - INTERVAL '7 days'
             GROUP BY DATE(created_at), event_type
             ORDER BY DATE(created_at)`,
            [filterValue]
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
