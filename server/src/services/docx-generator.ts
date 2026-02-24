/**
 * DOCX Generator for Resume Sandbox
 * Uses docx library to generate Word documents from sandbox data
 */

import {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    Packer,
} from 'docx';
import { SandboxData, SandboxElement } from '@resumebuilder/shared';

// Convert font size from px to half-points (Word uses half-points)
function pxToHalfPoints(px: number): number {
    // 1px ≈ 0.75pt, 1pt = 2 half-points
    return Math.round(px * 0.75 * 2);
}

// Convert color to hex (remove # if present)
function toHex(color?: string): string | undefined {
    if (!color) return undefined;
    return color.replace('#', '');
}

// Get font weight as boolean
function isBold(weight?: string): boolean {
    if (!weight) return false;
    const numericWeight = parseInt(weight, 10);
    return numericWeight >= 600 || weight === 'bold';
}

// Get alignment type
function getAlignment(align?: string): (typeof AlignmentType)[keyof typeof AlignmentType] {
    switch (align) {
        case 'center': return AlignmentType.CENTER;
        case 'right': return AlignmentType.RIGHT;
        default: return AlignmentType.LEFT;
    }
}

/**
 * Generate DOCX from sandbox data
 */
export async function generateSandboxDOCX(sandboxData: SandboxData): Promise<Buffer> {
    const textElements = sandboxData.elements
        .filter((el): el is SandboxElement & { type: 'text' } => el.type === 'text')
        .sort((a, b) => a.style.top - b.style.top); // Sort by vertical position

    const paragraphs: Paragraph[] = [];

    for (const element of textElements) {
        const content = element.content || '';
        const lines = content.split('\n');

        for (const line of lines) {
            if (!line.trim()) {
                paragraphs.push(new Paragraph({ spacing: { after: 200 } }));
                continue;
            }

            const fontSize = element.style.fontSize || 12;
            const isHeading = fontSize >= 20;
            const isSubheading = fontSize >= 14 && fontSize < 20;

            paragraphs.push(
                new Paragraph({
                    alignment: getAlignment(element.style.textAlign),
                    heading: isHeading ? HeadingLevel.HEADING_1 :
                        isSubheading ? HeadingLevel.HEADING_2 : undefined,
                    spacing: {
                        after: isHeading ? 240 : isSubheading ? 160 : 80,
                    },
                    children: [
                        new TextRun({
                            text: line,
                            size: pxToHalfPoints(fontSize),
                            bold: isBold(element.style.fontWeight),
                            color: toHex(element.style.color),
                            font: sanitizeFont(element.style.fontFamily),
                        }),
                    ],
                })
            );
        }
    }

    // If no content, add placeholder
    if (paragraphs.length === 0) {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: 'Resume content will appear here',
                        color: '999999',
                        italics: true,
                    }),
                ],
            })
        );
    }

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 720,    // 0.5 inch in twips
                            right: 720,
                            bottom: 720,
                            left: 720,
                        },
                    },
                },
                children: paragraphs,
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    return Buffer.from(buffer);
}

/**
 * Sanitize font family for Word
 */
function sanitizeFont(fontFamily?: string): string {
    if (!fontFamily) return 'Calibri';

    // Remove quotes and get first font
    const cleaned = fontFamily.replace(/['"]/g, '').split(',')[0].trim();

    // Map web fonts to common Word fonts
    const fontMap: Record<string, string> = {
        'inter': 'Calibri',
        'roboto': 'Calibri',
        'open sans': 'Calibri',
        'lato': 'Calibri',
        'source sans pro': 'Calibri',
        'arial': 'Arial',
        'helvetica': 'Arial',
        'times new roman': 'Times New Roman',
        'georgia': 'Georgia',
        'verdana': 'Verdana',
    };

    const normalized = cleaned.toLowerCase();
    return fontMap[normalized] || 'Calibri';
}

/**
 * Extract plain text from sandbox (for ATS preview)
 */
export function extractPlainText(sandboxData: SandboxData): string {
    const textElements = sandboxData.elements
        .filter((el): el is SandboxElement & { type: 'text' } => el.type === 'text')
        .sort((a, b) => a.style.top - b.style.top);

    return textElements
        .map(el => el.content || '')
        .filter(Boolean)
        .join('\n\n');
}
