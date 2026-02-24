import puppeteer, { Browser, Page } from 'puppeteer';
import type { ResumeData, PageConstraint } from '@resumebuilder/shared';
import { renderTemplate } from './template-renderer.js';

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

let browserInstance: Browser | null = null;

/**
 * Get or create a shared browser instance
 */
async function getBrowser(): Promise<Browser> {
    if (!browserInstance || !browserInstance.connected) {
        browserInstance = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
        });
    }
    return browserInstance;
}

/**
 * Check page constraints and detect overflow
 */
async function checkConstraints(page: Page): Promise<PageConstraint> {
    const constraint = await page.evaluate(() => {
        const pageHeight = 1123; // A4 height in px at 96dpi
        const maxPages = 2;

        // Get total content height
        const body = document.body;
        const totalHeight = body.scrollHeight;
        const currentPages = Math.ceil(totalHeight / pageHeight);

        // Find overflowing sections
        const overflowingSections: string[] = [];
        const sections = document.querySelectorAll('[data-section]');

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const startPage = Math.floor(rect.top / pageHeight);
            const endPage = Math.floor(rect.bottom / pageHeight);

            // If section spans pages, it might be overflowing
            if (endPage > startPage && rect.height > pageHeight * 0.5) {
                const sectionName = section.getAttribute('data-section') || 'unknown';
                overflowingSections.push(sectionName);
            }
        });

        return {
            currentPages,
            maxPages,
            overflowingSections,
            status: currentPages > maxPages ? 'overflow' :
                currentPages === maxPages ? 'warning' : 'ok',
        };
    });

    return constraint as PageConstraint;
}

/**
 * Generate PDF from resume data
 */
export async function generatePDF(resumeData: ResumeData): Promise<{
    pdfBuffer: Buffer;
    constraints: PageConstraint;
}> {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        // Set viewport to A4 dimensions
        await page.setViewport({
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            deviceScaleFactor: 2, // Retina quality
        });

        // Render HTML from template
        const html = renderTemplate(resumeData);
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Check constraints
        const constraints = await checkConstraints(page);

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            preferCSSPageSize: true,
        });

        return {
            pdfBuffer: Buffer.from(pdfBuffer),
            constraints,
        };
    } finally {
        await page.close();
    }
}

/**
 * Generate PDF from sandbox data
 */
import { renderSandbox } from './sandbox-renderer.js';
import { SandboxData } from '@resumebuilder/shared';

export async function generateSandboxPDF(
    sandboxData: SandboxData,
    isPro: boolean = false,
    customWatermark?: string,
    watermarkStyle: 'tiled' | 'corner' = 'tiled'
): Promise<Buffer> {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        await page.setViewport({
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            deviceScaleFactor: 2,
        });

        const html = renderSandbox(sandboxData, { isPro, customWatermark, watermarkStyle });
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            preferCSSPageSize: true,
        });

        return Buffer.from(pdfBuffer);
    } finally {
        await page.close();
    }
}

/**
 * Generate preview HTML
 */
export async function generatePreview(resumeData: ResumeData): Promise<{
    html: string;
    constraints: PageConstraint;
}> {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        await page.setViewport({
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
        });

        const html = renderTemplate(resumeData);
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const constraints = await checkConstraints(page);

        return { html, constraints };
    } finally {
        await page.close();
    }
}

/**
 * Cleanup browser on shutdown
 */
export async function closeBrowser(): Promise<void> {
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
    }
}

// Graceful shutdown
process.on('SIGTERM', closeBrowser);
process.on('SIGINT', closeBrowser);
