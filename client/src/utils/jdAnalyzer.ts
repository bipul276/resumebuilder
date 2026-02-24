import { SandboxElement, generateId } from '@resumebuilder/shared';

// Keywords to ignore (common words)
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'shall', 'can', 'need', 'dare', 'ought', 'used', 'that', 'this', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom',
    'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 'just', 'about', 'above', 'after', 'again', 'against',
    'any', 'because', 'before', 'below', 'between', 'during', 'into', 'through',
    'under', 'until', 'while', 'our', 'your', 'their', 'its', 'my', 'his', 'her',
    'up', 'down', 'out', 'off', 'over', 'then', 'once', 'here', 'there', 'also',
    'well', 'work', 'working', 'ability', 'able', 'looking', 'looking', 'experience',
    'required', 'preferred', 'including', 'skills', 'position', 'role', 'job',
    'responsibilities', 'requirements', 'qualifications', 'candidate', 'team',
    'company', 'years', 'strong', 'excellent', 'good', 'great', 'etc', 'new',
]);

// Technical skill keywords (prioritize these)
const TECH_KEYWORDS = new Set([
    'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue', 'node',
    'nodejs', 'express', 'mongodb', 'postgresql', 'mysql', 'sql', 'nosql', 'aws',
    'azure', 'gcp', 'docker', 'kubernetes', 'git', 'github', 'ci', 'cd', 'cicd',
    'agile', 'scrum', 'rest', 'api', 'graphql', 'html', 'css', 'sass', 'tailwind',
    'webpack', 'babel', 'jest', 'testing', 'tdd', 'bdd', 'linux', 'unix', 'bash',
    'shell', 'terraform', 'ansible', 'jenkins', 'redis', 'elasticsearch', 'kafka',
    'microservices', 'serverless', 'lambda', 'figma', 'photoshop', 'illustrator',
    'sketch', 'xd', 'ui', 'ux', 'frontend', 'backend', 'fullstack', 'devops',
    'sre', 'machine', 'learning', 'ml', 'ai', 'data', 'analytics', 'tableau',
    'powerbi', 'excel', 'salesforce', 'hubspot', 'marketing', 'seo', 'sem',
    'ppc', 'google', 'ads', 'facebook', 'linkedin', 'crm', 'erp', 'sap',
    'oracle', 'jira', 'confluence', 'slack', 'teams', 'zoom', 'mobile', 'ios',
    'android', 'swift', 'kotlin', 'flutter', 'react-native', 'native',
]);

export interface JDKeyword {
    word: string;
    count: number;
    isTechnical: boolean;
    category: 'hard_skill' | 'soft_skill' | 'tool' | 'certification' | 'general';
    foundInResume: boolean;
}

export interface JDAnalysis {
    keywords: JDKeyword[];
    matchScore: number;           // 0-100 overall match
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
    analyzedAt: string;
}

// Extract keywords from job description
export function extractKeywords(text: string): JDKeyword[] {
    const words = text.toLowerCase()
        .replace(/[^a-z0-9\s\-+#.]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2);

    // Count word frequency
    const wordCount = new Map<string, number>();
    words.forEach(word => {
        if (!STOP_WORDS.has(word)) {
            wordCount.set(word, (wordCount.get(word) || 0) + 1);
        }
    });

    // Also extract phrases (bigrams)
    for (let i = 0; i < words.length - 1; i++) {
        const phrase = `${words[i]} ${words[i + 1]}`;
        if (!STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i + 1])) {
            wordCount.set(phrase, (wordCount.get(phrase) || 0) + 1);
        }
    }

    // Convert to keyword array
    const keywords: JDKeyword[] = [];
    wordCount.forEach((count, word) => {
        // Skip very common words with low occurrence
        if (count === 1 && word.split(' ').length === 1) {
            // Check if it's a tech term (keep it)
            const isTech = TECH_KEYWORDS.has(word.toLowerCase());
            if (!isTech && !word.includes('+') && !word.includes('#')) {
                return; // Skip non-tech single occurrence words
            }
        }

        const isTechnical = TECH_KEYWORDS.has(word.toLowerCase()) ||
            word.includes('+') ||
            word.includes('#') ||
            word.match(/^\d+\+?$/) !== null;

        keywords.push({
            word,
            count,
            isTechnical,
            category: categorizeKeyword(word),
            foundInResume: false,
        });
    });

    // Sort by importance (tech first, then by count)
    keywords.sort((a, b) => {
        if (a.isTechnical && !b.isTechnical) return -1;
        if (!a.isTechnical && b.isTechnical) return 1;
        return b.count - a.count;
    });

    return keywords.slice(0, 30); // Top 30 keywords
}

// Categorize a keyword
function categorizeKeyword(word: string): 'hard_skill' | 'soft_skill' | 'tool' | 'certification' | 'general' {
    const lowerWord = word.toLowerCase();

    // Technical tools
    if (TECH_KEYWORDS.has(lowerWord)) return 'hard_skill';

    // Soft skills patterns
    const softSkills = ['communication', 'leadership', 'collaboration', 'teamwork',
        'problem-solving', 'analytical', 'creative', 'organized', 'detail-oriented',
        'adaptable', 'flexible', 'motivated', 'proactive', 'initiative'];
    if (softSkills.some(s => lowerWord.includes(s))) return 'soft_skill';

    // Certifications
    if (lowerWord.includes('certified') || lowerWord.includes('certification') ||
        ['pmp', 'aws', 'cpa', 'cfa', 'mba', 'phd', 'msw', 'rn', 'pe'].includes(lowerWord)) {
        return 'certification';
    }

    return 'general';
}

// Analyze JD against resume
export function analyzeJD(jdText: string, elements: SandboxElement[]): JDAnalysis {
    // Extract resume text
    const resumeText = elements
        .filter(el => el.type === 'text' && el.content)
        .map(el => el.content)
        .join(' ')
        .toLowerCase();

    // Get JD keywords
    const keywords = extractKeywords(jdText);

    // Check which keywords are in resume
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    keywords.forEach(kw => {
        const found = resumeText.includes(kw.word.toLowerCase());
        kw.foundInResume = found;
        if (found) {
            matchedKeywords.push(kw.word);
        } else {
            missingKeywords.push(kw.word);
        }
    });

    // Calculate match score
    const totalWeight = keywords.reduce((sum, kw) => sum + (kw.isTechnical ? 2 : 1), 0);
    const matchedWeight = keywords
        .filter(kw => kw.foundInResume)
        .reduce((sum, kw) => sum + (kw.isTechnical ? 2 : 1), 0);

    const matchScore = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

    // Generate suggestions
    const suggestions: string[] = [];

    // Missing technical skills
    const missingTech = keywords
        .filter(kw => kw.isTechnical && !kw.foundInResume)
        .slice(0, 3);
    if (missingTech.length > 0) {
        suggestions.push(`Add these technical skills: ${missingTech.map(k => k.word).join(', ')}`);
    }

    // Score-based suggestions
    if (matchScore < 40) {
        suggestions.push('Your resume needs significant tailoring for this role');
    } else if (matchScore < 60) {
        suggestions.push('Consider adding more keywords from the job description');
    } else if (matchScore < 80) {
        suggestions.push('Good match! A few more keywords could improve your chances');
    }

    // Category-specific suggestions
    const missingSoft = keywords
        .filter(kw => kw.category === 'soft_skill' && !kw.foundInResume);
    if (missingSoft.length > 0) {
        suggestions.push(`Highlight these soft skills: ${missingSoft.slice(0, 2).map(k => k.word).join(', ')}`);
    }

    return {
        keywords,
        matchScore,
        matchedKeywords,
        missingKeywords,
        suggestions,
        analyzedAt: new Date().toISOString(),
    };
}

// Get match score color
export function getMatchScoreColor(score: number): string {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#ca8a04';
    if (score >= 40) return '#ea580c';
    return '#dc2626';
}

// Get match score label
export function getMatchScoreLabel(score: number): string {
    if (score >= 80) return 'Strong Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Partial Match';
    return 'Weak Match';
}
