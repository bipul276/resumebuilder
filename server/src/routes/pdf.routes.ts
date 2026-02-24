import { Router } from 'express';
import type { Request, Response } from 'express';
import type { GeneratePDFRequest, PreviewRequest } from '@resumebuilder/shared';
import { generatePDF, generatePreview } from '../services/pdf-generator.js';
import { authenticateToken } from './auth.routes.js';
import { query } from '../db/index.js';

export const pdfRouter = Router();

pdfRouter.post('/generate-pdf', async (req: Request, res: Response) => {
    try {
        const { resumeData } = req.body as GeneratePDFRequest;

        if (!resumeData) {
            return res.status(400).json({
                success: false,
                error: 'Resume data is required',
            });
        }

        // Debug logging
        console.log('=== PDF Generation Request ===');
        console.log('Template ID:', resumeData.templateId);
        console.log('Skills count:', resumeData.skills?.length || 0);
        console.log('Work experience count:', resumeData.workExperience?.length || 0);
        console.log('Projects count:', resumeData.projects?.length || 0);
        console.log('Section order:', resumeData.settings?.sectionOrder);

        const { pdfBuffer, constraints } = await generatePDF(resumeData);

        if (constraints.status === 'overflow') {
            console.warn('PDF generated with overflow warning:', constraints.overflowingSections);
        }

        console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${resumeData.personalInfo.firstName || 'resume'}_resume.pdf"`);
        res.setHeader('X-Constraints', JSON.stringify(constraints));
        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'PDF generation failed',
        });
    }
});

pdfRouter.post('/generate-sandbox-pdf', authenticateToken, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId || (req as any).userId;
        const { elements, customWatermark, watermarkStyle = 'tiled', ...sandboxData } = req.body;

        if (!elements) {
            return res.status(400).json({
                success: false,
                error: 'Sandbox data is required',
            });
        }

        // Fetch user tier to enforce limits
        const userResult = await query(
            'SELECT tier FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userTier = userResult.rows[0].tier;
        const isPro = userTier === 'pro' || userTier === 'pro_plus';
        const canRemoveWatermark = isPro;
        const canCustomWatermark = userTier === 'pro_plus';

        // Enforce watermark rules
        const validCustomWatermark = canCustomWatermark ? customWatermark : undefined;
        // If not pro, ignore watermarkStyle and force tiled
        const validWatermarkStyle = canCustomWatermark ? watermarkStyle : 'tiled';

        console.log('=== Sandbox PDF Generation Request ===');
        console.log('User Tier:', userTier);
        console.log('Is Pro (Calculated):', canRemoveWatermark);
        console.log('Custom Watermark:', validCustomWatermark || 'none');

        const { generateSandboxPDF } = await import('../services/pdf-generator.js');
        const pdfBuffer = await generateSandboxPDF(
            { elements, ...sandboxData },
            canRemoveWatermark,
            validCustomWatermark,
            validWatermarkStyle
        );

        console.log('Sandbox PDF generated successfully, size:', pdfBuffer.length, 'bytes');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="sandbox_resume.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Sandbox PDF generation error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'PDF generation failed',
        });
    }
});

pdfRouter.post('/preview', async (req: Request, res: Response) => {
    try {
        const { resumeData } = req.body as PreviewRequest;

        if (!resumeData) {
            return res.status(400).json({
                success: false,
                error: 'Resume data is required',
            });
        }

        const { html, constraints } = await generatePreview(resumeData);

        res.json({
            success: true,
            html,
            constraints,
        });
    } catch (error) {
        console.error('Preview generation error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Preview generation failed',
        });
    }
});

pdfRouter.get('/templates', (req: Request, res: Response) => {
    res.json({
        success: true,
        templates: [
            { id: 'modern', name: 'Modern', description: 'Two-column layout with sidebar' },
            { id: 'classic', name: 'Classic', description: 'Traditional single-column format' },
            { id: 'tech', name: 'Tech', description: 'Developer-focused dark theme' },
            { id: 'minimal', name: 'Minimal', description: 'Clean, simple design' },
            { id: 'executive', name: 'Executive', description: 'Professional corporate style' },
            { id: 'creative', name: 'Creative', description: 'Bold colors, unique layout' },
            { id: 'compact', name: 'Compact', description: 'Dense, fits more content' },
            { id: 'professional', name: 'Professional', description: 'Traditional but modern' },
            { id: 'elegant', name: 'Elegant', description: 'Refined, sophisticated design' },
            { id: 'bold', name: 'Bold', description: 'Strong headers, high contrast' },
            { id: 'simple', name: 'Simple', description: 'Plain and straightforward' },
            { id: 'academic', name: 'Academic', description: 'For academic/research positions' },
            { id: 'timeline', name: 'Timeline', description: 'Visual timeline for experience' },
            { id: 'glance', name: 'Glance', description: 'Modern sidebar with photo' },
            { id: 'identity', name: 'Identity', description: 'Header with photo and name' },
        ],
    });
});

// DOCX Export
pdfRouter.post('/generate-sandbox-docx', async (req: Request, res: Response) => {
    try {
        const sandboxData = req.body;

        if (!sandboxData || !sandboxData.elements) {
            return res.status(400).json({
                success: false,
                error: 'Sandbox data is required',
            });
        }

        console.log('=== Sandbox DOCX Generation Request ===');
        console.log('Elements count:', sandboxData.elements.length);

        const { generateSandboxDOCX } = await import('../services/docx-generator.js');
        const docxBuffer = await generateSandboxDOCX(sandboxData);

        console.log('Sandbox DOCX generated successfully, size:', docxBuffer.length, 'bytes');

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="sandbox_resume.docx"`);
        res.send(docxBuffer);
    } catch (error) {
        console.error('Sandbox DOCX generation error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'DOCX generation failed',
        });
    }
});

// Plain Text Export (for ATS preview)
pdfRouter.post('/generate-sandbox-text', async (req: Request, res: Response) => {
    try {
        const sandboxData = req.body;

        if (!sandboxData || !sandboxData.elements) {
            return res.status(400).json({
                success: false,
                error: 'Sandbox data is required',
            });
        }

        const { extractPlainText } = await import('../services/docx-generator.js');
        const plainText = extractPlainText(sandboxData);

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="sandbox_resume.txt"`);
        res.send(plainText);
    } catch (error) {
        console.error('Plain text extraction error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Text extraction failed',
        });
    }
});

