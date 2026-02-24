import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken } from './auth.routes.js';
import { query } from '../db/index.js';

const router = express.Router();

// Initialize Gemini
// Remove top-level initialization
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

router.post('/improve', authenticateToken, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId || (req as any).userId;
        const { text, type, context } = req.body;

        // Verify tier
        const userResult = await query('SELECT tier FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0 || userResult.rows[0].tier !== 'pro_plus') {
            return res.status(403).json({ error: 'AI features are available on Pro+ plan only' });
        }

        if (!process.env.GOOGLE_API_KEY) {
            return res.status(500).json({ error: 'AI service not configured (Missing API Key)' });
        }

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Initialize Gemini with the key available at runtime
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        // Use 2.5 flash as it proved more reliable for free tier in testing
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let prompt = `You are a professional resume writer. Your task is to improve the following text for a resume. 
        CRITICAL INSTRUCTION: Return ONLY the improved text. Do not include any conversational filler (e.g., "Here is the improved version"). Do not provide multiple options unless asked. Keep the response strictly under 300 characters.`;

        if (type === 'experience') {
            prompt += `It is a bullet point for a work experience section. Make it achievement-oriented, use strong action verbs, and quantify results if possible. Keep it concise. `;
        } else if (type === 'summary') {
            prompt += `It is a professional summary. Make it impactful and tailored to the industry. `;
        }

        if (context) {
            prompt += `Context: ${context}. `;
        }

        prompt += `\n\nOriginal Text: "${text}"\n\nImproved Version:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const improvedText = response.text().trim();

        res.json({ improvedText });
    } catch (error: any) {
        console.error('AI Improve Error Details:', {
            message: error.message,
            apiKeyPresent: !!process.env.GOOGLE_API_KEY,
            userId: (req as any).userId
        });

        if (error.message?.includes('API key not valid')) {
            return res.status(500).json({ error: 'Invalid AI API Key configured on server' });
        }

        if (error.status === 429 || error.message?.includes('429') || error.message?.includes('usage limit')) {
            return res.status(429).json({ error: 'AI usage limit exceeded. Please wait a minute.' });
        }

        res.status(500).json({ error: 'Failed to improve text', details: error.message });
    }
});

router.post('/generate', authenticateToken, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId || (req as any).userId;
        const { prompt, type } = req.body;

        // Verify tier
        const userResult = await query('SELECT tier FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0 || userResult.rows[0].tier !== 'pro_plus') {
            return res.status(403).json({ error: 'AI features are available on Pro+ plan only' });
        }

        if (!process.env.GOOGLE_API_KEY) {
            return res.status(500).json({ error: 'AI service not configured (Missing API Key)' });
        }

        // Initialize Gemini with the key available at runtime
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        // Use 2.5 flash as it proved more reliable for free tier in testing
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let fullPrompt = `Generate 3-5 professional resume bullet points for: "${prompt}". `;

        if (type === 'skills') {
            fullPrompt = `List 5 key technical skills relevant to: "${prompt}". Return as a comma-separated list.`;
        }

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const generatedText = response.text().trim();

        // Parse list if it's a bullet point generation
        let suggestions: string[] = [];
        if (type === 'skills') {
            suggestions = generatedText.split(',').map(s => s.trim());
        } else {
            // Split by newlines and remove standard bullet point markers
            suggestions = generatedText.split('\n')
                .map(line => line.replace(/^[\s-•*]+/, '').trim())
                .filter(line => line.length > 0);
        }

        res.json({ suggestions });
    } catch (error: any) {
        console.error('AI Generate Error Details:', {
            message: error.message,
            apiKeyPresent: !!process.env.GOOGLE_API_KEY,
            userId: (req as any).userId
        });
        if (error.status === 429 || error.message?.includes('429') || error.message?.includes('usage limit')) {
            return res.status(429).json({ error: 'AI usage limit exceeded. Please wait a minute.' });
        }
        res.status(500).json({ error: 'Failed to generate content', details: error.message });
    }
});

export default router;
