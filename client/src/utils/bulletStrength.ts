/**
 * Bullet Strength Analyzer
 * Rates resume bullet points on a 1-5 scale based on:
 * - Action verb usage
 * - Quantification (numbers, percentages, metrics)
 * - Specificity
 * - Length appropriateness
 */

export interface BulletScore {
    score: number;          // 1-5 stars
    label: string;          // "Weak", "Average", "Strong", etc.
    color: string;
    issues: string[];
    suggestions: string[];
}

// Strong action verbs by category
const STRONG_VERBS = {
    leadership: ['led', 'managed', 'directed', 'oversaw', 'spearheaded', 'championed', 'orchestrated'],
    achievement: ['achieved', 'exceeded', 'surpassed', 'delivered', 'accomplished', 'attained'],
    creation: ['created', 'designed', 'developed', 'built', 'launched', 'initiated', 'established'],
    improvement: ['improved', 'enhanced', 'optimized', 'streamlined', 'increased', 'reduced', 'accelerated'],
    analysis: ['analyzed', 'evaluated', 'assessed', 'identified', 'researched', 'investigated'],
    collaboration: ['collaborated', 'partnered', 'coordinated', 'facilitated', 'negotiated'],
};

// Weak verbs to avoid
const WEAK_VERBS = ['helped', 'assisted', 'worked on', 'was responsible for', 'participated in', 'did', 'made', 'handled'];

// Quantification patterns
const QUANTITY_PATTERNS = [
    /\d+%/,                          // Percentages
    /\$[\d,]+/,                      // Dollar amounts
    /\d+\+?/,                        // Numbers
    /\d+x/i,                         // Multipliers
    /\d+ (users|clients|customers|team members|employees|projects)/i,
];

export function analyzeBullet(text: string): BulletScore {
    const lower = text.toLowerCase().trim();
    const words = lower.split(/\s+/);
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 3; // Start at average

    // Check 1: Starts with action verb
    const firstWord = words[0]?.replace(/[^a-z]/g, '');
    const isStrongVerb = Object.values(STRONG_VERBS).flat().includes(firstWord);
    const isWeakVerb = WEAK_VERBS.some(v => lower.startsWith(v));

    if (isStrongVerb) {
        score += 1;
    } else if (isWeakVerb) {
        score -= 1;
        issues.push('Starts with a weak verb');
        suggestions.push(`Replace "${firstWord}" with a stronger action verb`);
    } else if (!firstWord || !/^[a-z]+ed$/.test(firstWord)) {
        issues.push('Consider starting with an action verb');
        suggestions.push('Use past tense action verbs like "Led", "Developed", "Achieved"');
    }

    // Check 2: Quantification
    const hasQuantity = QUANTITY_PATTERNS.some(p => p.test(text));
    if (hasQuantity) {
        score += 1;
    } else {
        issues.push('No quantifiable metrics');
        suggestions.push('Add numbers: %, $, count, or time saved');
    }

    // Check 3: Length check (ideal: 10-25 words)
    if (words.length < 5) {
        score -= 1;
        issues.push('Too brief - lacks detail');
        suggestions.push('Add more context about impact and scope');
    } else if (words.length > 30) {
        score -= 0.5;
        issues.push('Consider shortening');
        suggestions.push('Focus on the most impactful result');
    } else if (words.length >= 10 && words.length <= 25) {
        score += 0.5;
    }

    // Check 4: Contains result/impact words
    const impactWords = ['resulted', 'improved', 'increased', 'decreased', 'saved', 'generated', 'reduced', 'grew', 'expanded', 'boosted'];
    const hasImpact = impactWords.some(w => lower.includes(w));
    if (hasImpact) {
        score += 0.5;
    }

    // Normalize score to 1-5 range
    score = Math.max(1, Math.min(5, Math.round(score)));

    return {
        score,
        label: getScoreLabel(score),
        color: getScoreColor(score),
        issues,
        suggestions,
    };
}

function getScoreLabel(score: number): string {
    switch (score) {
        case 5: return 'Excellent';
        case 4: return 'Strong';
        case 3: return 'Average';
        case 2: return 'Weak';
        default: return 'Needs Work';
    }
}

function getScoreColor(score: number): string {
    switch (score) {
        case 5: return '#16a34a';
        case 4: return '#22c55e';
        case 3: return '#ca8a04';
        case 2: return '#ea580c';
        default: return '#dc2626';
    }
}

// Analyze all bullets in a text block
export function analyzeAllBullets(text: string): { bullets: { text: string; score: BulletScore }[]; averageScore: number } {
    // Split by bullet points or newlines
    const lines = text.split(/[\n•\-\*]/).map(l => l.trim()).filter(l => l.length > 10);

    const bullets = lines.map(line => ({
        text: line,
        score: analyzeBullet(line),
    }));

    const averageScore = bullets.length > 0
        ? bullets.reduce((sum, b) => sum + b.score.score, 0) / bullets.length
        : 0;

    return { bullets, averageScore: Math.round(averageScore * 10) / 10 };
}

// Render star rating
export function renderStars(score: number): string {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
}
