import { useState } from 'react';
import { Search, Target, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';

interface KeywordMatch {
    keyword: string;
    found: boolean;
    context?: string;
}

export function ATSChecker() {
    const { resume } = useResumeStore();
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState<{
        score: number;
        matches: KeywordMatch[];
        suggestions: string[];
    } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const extractKeywords = (text: string): string[] => {
        // Common technical keywords and skills to look for
        const techPatterns = [
            // Programming languages
            /\b(javascript|typescript|python|java|c\+\+|c#|ruby|go|rust|php|swift|kotlin)\b/gi,
            // Frameworks
            /\b(react|angular|vue|node\.?js|express|django|flask|spring|\.net|rails|next\.?js)\b/gi,
            // Tools & platforms
            /\b(aws|azure|gcp|docker|kubernetes|jenkins|git|github|gitlab|jira|confluence)\b/gi,
            // Databases
            /\b(sql|mysql|postgresql|mongodb|redis|elasticsearch|dynamodb|firebase)\b/gi,
            // Concepts
            /\b(agile|scrum|ci\/?cd|devops|microservices|rest|graphql|api|testing|tdd)\b/gi,
            // Soft skills often in JDs
            /\b(leadership|communication|collaboration|problem.solving|analytical|teamwork)\b/gi,
            // Business & Management
            /\b(strategy|project management|budget|stakeholder|revenue|growth|sales|marketing|operations|finance|accounting)\b/gi,
            // Design & Product
            /\b(ui|ux|design|product|user research|wireframing|prototyping|figma|adobe)\b/gi,
            // General Corporate
            /\b(analysis|reporting|optimization|process|compliance|regulatory|hr|recruiting)\b/gi,
        ];

        const keywords = new Set<string>();

        // Extract from patterns
        techPatterns.forEach(pattern => {
            const matches = text.matchAll(pattern);
            for (const match of matches) {
                keywords.add(match[0].toLowerCase());
            }
        });

        // Also extract capitalized words that might be important
        const capitalizedWords = text.match(/\b[A-Z][a-zA-Z]+\b/g) || [];
        capitalizedWords.forEach(word => {
            if (word.length > 3) {
                keywords.add(word.toLowerCase());
            }
        });

        return Array.from(keywords);
    };

    const getResumeText = (): string => {
        const parts = [
            resume.summary,
            resume.personalInfo.title,
            ...resume.workExperience.flatMap(exp => [
                exp.position,
                exp.company,
                ...exp.bullets,
            ]),
            ...resume.education.map(edu => `${edu.degree} ${edu.field || ''}`),
            ...resume.skills.map(skill => skill.name),
            ...resume.projects.flatMap(proj => [
                proj.name,
                proj.description,
                ...proj.technologies,
            ]),
        ];

        return parts.filter(Boolean).join(' ').toLowerCase();
    };

    const analyzeResume = () => {
        if (!jobDescription.trim()) return;

        setIsAnalyzing(true);

        // Simulate async analysis
        setTimeout(() => {
            const jdKeywords = extractKeywords(jobDescription);

            if (jdKeywords.length === 0) {
                setAnalysis({
                    score: 0,
                    matches: [],
                    suggestions: ['No keywords found in the job description to match against. Try pasting a more detailed description with technical skills and requirements.']
                });
                setIsAnalyzing(false);
                return;
            }

            const resumeText = getResumeText();

            const matches: KeywordMatch[] = jdKeywords.map(keyword => {
                const found = resumeText.includes(keyword.toLowerCase());
                return {
                    keyword,
                    found,
                    context: found ? findContext(resumeText, keyword) : undefined,
                };
            });

            const matchedCount = matches.filter(m => m.found).length;
            const score = jdKeywords.length > 0
                ? Math.round((matchedCount / jdKeywords.length) * 100)
                : 0;

            const missingKeywords = matches.filter(m => !m.found).map(m => m.keyword);
            const suggestions = generateSuggestions(missingKeywords);

            setAnalysis({ score, matches, suggestions });
            setIsAnalyzing(false);
        }, 500);
    };

    const findContext = (text: string, keyword: string): string => {
        const index = text.toLowerCase().indexOf(keyword.toLowerCase());
        if (index === -1) return '';
        const start = Math.max(0, index - 20);
        const end = Math.min(text.length, index + keyword.length + 20);
        return '...' + text.slice(start, end) + '...';
    };

    const generateSuggestions = (missing: string[]): string[] => {
        if (missing.length === 0) return ['Great job! Your resume matches the job description well.'];

        const suggestions = [];

        if (missing.length > 5) {
            suggestions.push(`Consider adding ${missing.length} missing keywords to improve your match score.`);
        }

        const techKeywords = missing.filter(k =>
            /^(react|angular|vue|node|python|java|aws|docker)/i.test(k)
        );
        if (techKeywords.length > 0) {
            suggestions.push(`Add technical skills: ${techKeywords.slice(0, 5).join(', ')}`);
        }

        if (missing.some(k => /leadership|management|team/i.test(k))) {
            suggestions.push('Highlight leadership experience in your bullet points.');
        }

        return suggestions;
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'var(--color-success)';
        if (score >= 40) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    return (
        <div className="fade-in">
            <div className="form-section">
                <h2 className="form-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={20} />
                    ATS Keyword Checker
                </h2>

                <p style={{
                    color: 'var(--color-text-secondary)',
                    marginBottom: '16px',
                    fontSize: 'var(--font-size-sm)',
                }}>
                    Paste a job description to see how well your resume matches the required keywords.
                </p>

                <div className="form-group">
                    <label className="form-label">Job Description</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Paste the job description here..."
                        rows={6}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>

                <button
                    className="btn btn-primary"
                    onClick={analyzeResume}
                    disabled={!jobDescription.trim() || isAnalyzing}
                    style={{ marginTop: '8px' }}
                >
                    <Search size={16} />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
                </button>
            </div>

            {analysis && (
                <div className="form-section">
                    {/* Score Display */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        background: 'var(--color-bg-panel)',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '20px',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '48px',
                                fontWeight: 700,
                                color: getScoreColor(analysis.score),
                            }}>
                                {analysis.score}%
                            </div>
                            <div style={{ color: 'var(--color-text-secondary)' }}>
                                ATS Match Score
                            </div>
                        </div>
                    </div>

                    {/* Keyword Matches */}
                    <h3 style={{
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 600,
                        marginBottom: '12px',
                    }}>
                        Keyword Analysis
                    </h3>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '20px',
                    }}>
                        {analysis.matches.map((match, index) => (
                            <span
                                key={index}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '6px 12px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: 'var(--font-size-sm)',
                                    background: match.found
                                        ? 'rgba(16, 185, 129, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                    color: match.found
                                        ? 'var(--color-success)'
                                        : 'var(--color-danger)',
                                    border: `1px solid ${match.found ? 'var(--color-success)' : 'var(--color-danger)'}`,
                                }}
                                title={match.context || 'Not found in resume'}
                            >
                                {match.found ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                {match.keyword}
                            </span>
                        ))}
                    </div>

                    {/* Suggestions */}
                    {analysis.suggestions.length > 0 && (
                        <div style={{
                            background: 'var(--color-bg-panel)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '16px',
                            border: '1px solid var(--color-border)',
                        }}>
                            <h4 style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '12px',
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 600,
                            }}>
                                <AlertCircle size={16} />
                                Suggestions
                            </h4>
                            <ul style={{
                                listStyle: 'disc',
                                paddingLeft: '20px',
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--color-text-secondary)',
                            }}>
                                {analysis.suggestions.map((suggestion, index) => (
                                    <li key={index} style={{ marginBottom: '6px' }}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
