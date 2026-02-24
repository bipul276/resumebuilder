import { SandboxElement, generateId } from '@resumebuilder/shared';

// Content analysis types
export type ContentIssueSeverity = 'error' | 'warning' | 'suggestion';
export type ContentIssueCategory = 'bullets' | 'verbs' | 'density' | 'spacing' | 'structure';

export interface ContentIssue {
    id: string;
    elementId: string;
    severity: ContentIssueSeverity;
    category: ContentIssueCategory;
    message: string;
    suggestion: string;
    highlight?: { start: number; end: number }; // Text range to highlight
}

export interface ContentAnalysis {
    issues: ContentIssue[];
    stats: {
        bulletCount: number;
        wordCount: number;
        avgBulletLength: number;
        denseSections: number;
    };
    analyzedAt: string;
}

// Weak action verbs to flag
const WEAK_VERBS = [
    'helped', 'assisted', 'worked', 'was responsible', 'participated',
    'handled', 'dealt with', 'tasked with', 'involved in', 'did',
    'made', 'got', 'had', 'used', 'tried',
];

// Strong action verbs for suggestions
const STRONG_VERB_ALTERNATIVES: Record<string, string[]> = {
    'helped': ['Led', 'Facilitated', 'Enabled', 'Supported'],
    'assisted': ['Collaborated', 'Partnered', 'Contributed', 'Supported'],
    'worked': ['Executed', 'Operated', 'Managed', 'Delivered'],
    'was responsible': ['Owned', 'Managed', 'Directed', 'Oversaw'],
    'participated': ['Contributed', 'Engaged', 'Collaborated', 'Drove'],
    'handled': ['Managed', 'Resolved', 'Processed', 'Addressed'],
    'dealt with': ['Resolved', 'Managed', 'Addressed', 'Navigated'],
    'tasked with': ['Led', 'Spearheaded', 'Directed', 'Executed'],
    'involved in': ['Contributed to', 'Drove', 'Shaped', 'Influenced'],
    'did': ['Achieved', 'Completed', 'Delivered', 'Executed'],
    'made': ['Created', 'Developed', 'Designed', 'Built'],
    'got': ['Achieved', 'Obtained', 'Secured', 'Earned'],
    'had': ['Managed', 'Maintained', 'Held', 'Owned'],
    'used': ['Leveraged', 'Utilized', 'Employed', 'Applied'],
    'tried': ['Attempted', 'Piloted', 'Tested', 'Explored'],
};

// Common bullet point patterns
const BULLET_PATTERNS = [
    /^•\s/,       // Bullet
    /^-\s/,       // Dash
    /^–\s/,       // En dash
    /^—\s/,       // Em dash
    /^>\s/,       // Arrow
    /^→\s/,       // Unicode arrow
    /^✓\s/,       // Check
    /^✔\s/,       // Check
    /^\*\s/,      // Asterisk
    /^·\s/,       // Middle dot
];

// Detect bullet style
function detectBulletStyle(text: string): string | null {
    for (const pattern of BULLET_PATTERNS) {
        if (pattern.test(text)) {
            return text.match(pattern)?.[0].trim() || null;
        }
    }
    return null;
}

// Analyze content for issues
export function analyzeContent(elements: SandboxElement[]): ContentAnalysis {
    const issues: ContentIssue[] = [];
    const textElements = elements.filter(el => el.type === 'text' && el.content);

    let totalBullets = 0;
    let totalBulletWords = 0;
    let denseSections = 0;

    // Collect all bullet styles used
    const bulletStyles: Map<string, string[]> = new Map();

    textElements.forEach(element => {
        const lines = element.content.split('\n');

        lines.forEach(line => {
            const bulletStyle = detectBulletStyle(line);
            if (bulletStyle) {
                totalBullets++;
                const bulletText = line.replace(/^[•\-–—>→✓✔*·]\s*/, '');
                totalBulletWords += bulletText.split(/\s+/).filter(w => w.length > 0).length;

                if (!bulletStyles.has(bulletStyle)) {
                    bulletStyles.set(bulletStyle, []);
                }
                bulletStyles.get(bulletStyle)!.push(element.id);
            }
        });
    });

    // Check for inconsistent bullets
    if (bulletStyles.size > 1) {
        const styles = Array.from(bulletStyles.keys());
        const counts = styles.map(s => ({ style: s, count: bulletStyles.get(s)!.length }));
        counts.sort((a, b) => b.count - a.count);

        // Flag elements using minority bullet styles
        for (let i = 1; i < counts.length; i++) {
            const minorityStyle = counts[i].style;
            const elementIds = bulletStyles.get(minorityStyle)!;

            elementIds.forEach(elementId => {
                issues.push({
                    id: generateId(),
                    elementId,
                    severity: 'warning',
                    category: 'bullets',
                    message: `Inconsistent bullet style "${minorityStyle}" (most common: "${counts[0].style}")`,
                    suggestion: `Use "${counts[0].style}" for consistency across resume`,
                });
            });
        }
    }

    // Check for weak verbs
    textElements.forEach(element => {
        const text = element.content.toLowerCase();

        WEAK_VERBS.forEach(verb => {
            // Match at word boundaries
            const regex = new RegExp(`\\b${verb}\\b`, 'gi');
            const matches = text.match(regex);

            if (matches) {
                const alternatives = STRONG_VERB_ALTERNATIVES[verb] || ['a stronger action verb'];
                issues.push({
                    id: generateId(),
                    elementId: element.id,
                    severity: 'suggestion',
                    category: 'verbs',
                    message: `Weak verb "${verb}" detected`,
                    suggestion: `Replace with: ${alternatives.slice(0, 3).join(', ')}`,
                });
            }
        });
    });

    // Check for dense sections (high word count in small area)
    textElements.forEach(element => {
        const wordCount = element.content.split(/\s+/).filter(w => w.length > 0).length;
        const area = element.style.width * element.style.height;
        const density = wordCount / (area / 10000); // words per 10000 sq pixels

        if (density > 15 && wordCount > 30) {
            denseSections++;
            issues.push({
                id: generateId(),
                elementId: element.id,
                severity: 'warning',
                category: 'density',
                message: `Dense text block (${wordCount} words in tight space)`,
                suggestion: 'Consider splitting into smaller sections or increasing element size',
            });
        }
    });

    // Check spacing issues
    const sortedByTop = [...textElements].sort((a, b) => a.style.top - b.style.top);
    for (let i = 1; i < sortedByTop.length; i++) {
        const prev = sortedByTop[i - 1];
        const curr = sortedByTop[i];

        // Only check elements that are vertically adjacent (similar x position)
        const xOverlap = Math.abs(prev.style.left - curr.style.left) < 50;
        if (!xOverlap) continue;

        const gap = curr.style.top - (prev.style.top + prev.style.height);

        // Too close together
        if (gap < 4 && gap >= 0) {
            issues.push({
                id: generateId(),
                elementId: curr.id,
                severity: 'suggestion',
                category: 'spacing',
                message: `Very tight spacing (${gap.toFixed(0)}px gap from above element)`,
                suggestion: 'Add more vertical space for better readability (8-16px recommended)',
            });
        }

        // Inconsistent spacing (check if nearby elements have very different gaps)
        if (gap > 40 && i < sortedByTop.length - 1) {
            const next = sortedByTop[i + 1];
            const nextGap = next.style.top - (curr.style.top + curr.style.height);
            if (nextGap < gap * 0.5 && nextGap > 0) {
                issues.push({
                    id: generateId(),
                    elementId: curr.id,
                    severity: 'suggestion',
                    category: 'spacing',
                    message: `Large gap (${gap.toFixed(0)}px) may indicate section break`,
                    suggestion: 'Consider grouping into a section or evening out spacing',
                });
            }
        }
    }

    // Calculate stats
    const avgBulletLength = totalBullets > 0 ? Math.round(totalBulletWords / totalBullets) : 0;
    const totalWords = textElements.reduce((sum, el) =>
        sum + el.content.split(/\s+/).filter(w => w.length > 0).length, 0);

    return {
        issues,
        stats: {
            bulletCount: totalBullets,
            wordCount: totalWords,
            avgBulletLength,
            denseSections,
        },
        analyzedAt: new Date().toISOString(),
    };
}

// Get category icon
export function getCategoryIcon(category: ContentIssueCategory): string {
    switch (category) {
        case 'bullets': return '•';
        case 'verbs': return '💪';
        case 'density': return '📏';
        case 'spacing': return '↕️';
        case 'structure': return '🏗️';
        default: return '📝';
    }
}

// Get severity color
export function getContentSeverityColor(severity: ContentIssueSeverity): string {
    switch (severity) {
        case 'error': return '#dc2626';
        case 'warning': return '#ca8a04';
        case 'suggestion': return '#2563eb';
    }
}
