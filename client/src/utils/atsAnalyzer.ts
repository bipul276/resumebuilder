import { SandboxElement, ATSWarning, ATSAnalysis, generateId } from '@resumebuilder/shared';

// ATS-safe fonts (commonly recognized by parsers)
const ATS_SAFE_FONTS = [
    'arial', 'helvetica', 'times new roman', 'times', 'georgia',
    'cambria', 'calibri', 'garamond', 'verdana', 'trebuchet ms',
    'inter', 'roboto', 'open sans', 'lato', 'source sans pro'
];

// Analyze elements for ATS compatibility
export function analyzeForATS(elements: SandboxElement[]): ATSAnalysis {
    const warnings: ATSWarning[] = [];
    let extractedText = '';

    // Check each element
    elements.forEach((element) => {
        // Check for graphics/icons (ATS can't parse these)
        if (element.type === 'icon' || element.type === 'image') {
            warnings.push({
                id: generateId(),
                elementId: element.id,
                severity: 'warning',
                category: 'graphics',
                message: `${element.type === 'icon' ? 'Icon' : 'Image'} "${element.name}" may not be parsed by ATS`,
                suggestion: 'Consider adding text alternative or removing for ATS version',
            });
        }

        // Check for progress rings, skill bars, etc.
        if (['skillbar', 'progress_ring', 'rating_dots'].includes(element.type)) {
            warnings.push({
                id: generateId(),
                elementId: element.id,
                severity: 'warning',
                category: 'graphics',
                message: `Visual element "${element.name}" won't be parsed by ATS`,
                suggestion: 'Add a text-based skill list as alternative',
            });
        }

        // Check for non-standard fonts
        if (element.type === 'text' && element.style.fontFamily) {
            const font = element.style.fontFamily.toLowerCase();
            if (!ATS_SAFE_FONTS.some(f => font.includes(f))) {
                warnings.push({
                    id: generateId(),
                    elementId: element.id,
                    severity: 'info',
                    category: 'fonts',
                    message: `Font "${element.style.fontFamily}" may not render in all ATS`,
                    suggestion: 'Use Arial, Calibri, or Times New Roman for maximum compatibility',
                });
            }
        }

        // Check for very small text (hard to parse)
        if (element.type === 'text' && element.style.fontSize && element.style.fontSize < 9) {
            warnings.push({
                id: generateId(),
                elementId: element.id,
                severity: 'warning',
                category: 'content',
                message: `Text "${element.name}" is very small (${element.style.fontSize}px)`,
                suggestion: 'Use at least 10px font size for better parsing',
            });
        }

        // Check for text in shapes (might not parse)
        if (element.type === 'shape' && element.content) {
            warnings.push({
                id: generateId(),
                elementId: element.id,
                severity: 'error',
                category: 'layout',
                message: 'Text inside shapes is often not parsed by ATS',
                suggestion: 'Move text outside of decorative shapes',
            });
        }

        // Extract text content
        if (element.type === 'text' && element.content) {
            extractedText += element.content + '\n\n';
        }
    });

    // Check for container-based layouts (potential column issues)
    const containers = elements.filter(e => e.type === 'container');
    const horizontalContainers = containers.filter(e => e.props?.direction === 'row');

    if (horizontalContainers.length > 0) {
        warnings.push({
            id: generateId(),
            severity: 'warning',
            category: 'layout',
            message: `${horizontalContainers.length} horizontal container(s) detected`,
            suggestion: 'Multi-column layouts may confuse ATS. Consider single-column for ATS version.',
        });
    }

    // Check for timeline elements
    const timelines = elements.filter(e => e.type === 'timeline');
    if (timelines.length > 0) {
        warnings.push({
            id: generateId(),
            severity: 'warning',
            category: 'graphics',
            message: 'Timeline graphics won\'t be parsed by ATS',
            suggestion: 'Represent experience as standard text with dates',
        });
    }

    // Calculate score
    const errorCount = warnings.filter(w => w.severity === 'error').length;
    const warningCount = warnings.filter(w => w.severity === 'warning').length;
    const infoCount = warnings.filter(w => w.severity === 'info').length;

    // Score calculation: start at 100, deduct for issues
    let score = 100;
    score -= errorCount * 15;      // Errors are severe
    score -= warningCount * 8;     // Warnings are moderate
    score -= infoCount * 2;        // Info is minor
    score = Math.max(0, Math.min(100, score));

    // Word count
    const wordCount = extractedText.trim().split(/\s+/).filter(w => w.length > 0).length;

    // Minimum content threshold for meaningful score
    const MIN_WORDS_FOR_SCORE = 50;
    const isDraft = wordCount < MIN_WORDS_FOR_SCORE;

    // Keyword density analysis
    const keywordDensity = analyzeKeywordDensity(extractedText);

    return {
        score: isDraft ? null : score, // null indicates draft mode
        isDraft,
        minWordsRequired: MIN_WORDS_FOR_SCORE,
        warnings: isDraft ? [] : warnings, // Don't show warnings until content exists
        extractedText: extractedText.trim(),
        wordCount,
        keywordDensity,
        analyzedAt: new Date().toISOString(),
    };
}

// Analyze keyword density
function analyzeKeywordDensity(text: string): KeywordDensity {
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const totalWords = words.length;

    if (totalWords === 0) {
        return { topKeywords: [], totalWords: 0, uniqueWords: 0 };
    }

    // Stop words to filter out
    const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are', 'was', 'were', 'been', 'being', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'our', 'your', 'their', 'its', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very', 'just', 'also']);

    // Count frequencies
    const freq: Record<string, number> = {};
    words.forEach(word => {
        if (!stopWords.has(word)) {
            freq[word] = (freq[word] || 0) + 1;
        }
    });

    // Get top keywords
    const topKeywords = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({
            word,
            count,
            density: Math.round((count / totalWords) * 1000) / 10, // % with 1 decimal
        }));

    return {
        topKeywords,
        totalWords,
        uniqueWords: Object.keys(freq).length,
    };
}

export interface KeywordDensity {
    topKeywords: { word: string; count: number; density: number }[];
    totalWords: number;
    uniqueWords: number;
}

// Get score color
export function getScoreColor(score: number): string {
    if (score >= 80) return '#16a34a';  // Green
    if (score >= 60) return '#ca8a04';  // Yellow
    if (score >= 40) return '#ea580c';  // Orange
    return '#dc2626';                    // Red
}

// Get score label
export function getScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
}

// Get severity color
export function getSeverityColor(severity: 'error' | 'warning' | 'info'): string {
    switch (severity) {
        case 'error': return '#dc2626';
        case 'warning': return '#ca8a04';
        case 'info': return '#2563eb';
    }
}

// Get category icon name
export function getCategoryLabel(category: string): string {
    switch (category) {
        case 'layout': return '📐 Layout';
        case 'graphics': return '🖼️ Graphics';
        case 'fonts': return '🔤 Fonts';
        case 'structure': return '📄 Structure';
        case 'content': return '📝 Content';
        default: return category;
    }
}
