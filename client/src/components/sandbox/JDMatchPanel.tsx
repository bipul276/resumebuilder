import { useState } from 'react';
import { useSandboxStore } from '../../stores/useSandboxStore';
import { useTier } from '../../contexts/TierContext';
import { LockedFeaturePanel } from '../common/LockedFeaturePanel';
import { analyzeJD, getMatchScoreColor, getMatchScoreLabel, JDAnalysis } from '../../utils/jdAnalyzer';
import {
    Briefcase,
    Target,
    CheckCircle2,
    XCircle,
    ArrowRight,
    RefreshCw,
    Search,
    AlertTriangle,
    Lightbulb,
} from 'lucide-react';

export function JDMatchPanel() {
    const { tier } = useTier();
    const { data } = useSandboxStore();
    const [jdText, setJdText] = useState('');

    if (tier === 'free') {
        return <LockedFeaturePanel feature="Job Description Match" tier="Pro" description="Scan your resume against job descriptions to increase your chances of getting hired." />;
    }
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<JDAnalysis | null>(null);

    const handleAnalyze = () => {
        if (!jdText.trim()) return;

        setIsAnalyzing(true);
        // Simulate processing time for better feel
        setTimeout(() => {
            const result = analyzeJD(jdText, data.elements);
            setAnalysis(result);
            setIsAnalyzing(false);
        }, 600);
    };

    if (!analysis && !isAnalyzing) {
        return (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <div style={{
                        width: '48px', height: '48px', margin: '0 auto 12px',
                        borderRadius: '12px', background: '#eff6ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Target size={24} color="#2563eb" />
                    </div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#111827' }}>
                        Job Match Scanner
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>
                        Paste a job description to see how well your resume matches.
                    </p>
                </div>

                <textarea
                    placeholder="Paste job description here..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    style={{
                        flex: 1,
                        minHeight: '200px',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                        lineHeight: 1.5,
                        resize: 'none',
                        outline: 'none',
                    }}
                />

                <button
                    onClick={handleAnalyze}
                    disabled={!jdText.trim()}
                    style={{
                        padding: '12px',
                        backgroundColor: jdText.trim() ? '#2563eb' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: jdText.trim() ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s',
                    }}
                >
                    <Search size={16} />
                    Scan Match
                </button>
            </div>
        );
    }

    if (isAnalyzing) {
        return (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
                <RefreshCw size={32} className="animate-spin" style={{ color: '#2563eb', marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 8px', color: '#111827', fontSize: '16px' }}>Scanning Keywords...</h3>
                <p style={{ fontSize: '12px' }}>Comparing your resume against role requirements</p>
            </div>
        );
    }

    // Results view
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: '13px' }}>
            {/* Header / Score */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
            }}>
                <button
                    onClick={() => setAnalysis(null)}
                    style={{
                        border: 'none', background: 'none', padding: 0,
                        color: '#6b7280', fontSize: '11px', display: 'flex',
                        alignItems: 'center', gap: '4px', marginBottom: '12px',
                        cursor: 'pointer'
                    }}
                >
                    ← Scan new job
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={getMatchScoreColor(analysis!.matchScore)}
                                strokeWidth="3"
                                strokeDasharray={`${analysis!.matchScore}, 100`}
                            />
                        </svg>
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '16px', color: '#111827'
                        }}>
                            {analysis!.matchScore}%
                        </div>
                    </div>
                    <div>
                        <div style={{
                            fontSize: '16px', fontWeight: 700,
                            color: getMatchScoreColor(analysis!.matchScore)
                        }}>
                            {getMatchScoreLabel(analysis!.matchScore)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            {analysis!.matchedKeywords.length} of {analysis!.keywords.length} keywords matched
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

                {/* Suggestions */}
                {analysis!.suggestions.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ margin: '0 0 8px', fontSize: '11px', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.5px' }}>
                            AI Suggestions
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {analysis!.suggestions.map((suggestion, i) => (
                                <div key={i} style={{
                                    padding: '10px', backgroundColor: '#f0f9ff',
                                    border: '1px solid #bae6fd', borderRadius: '6px',
                                    display: 'flex', gap: '8px', fontSize: '12px', color: '#0369a1'
                                }}>
                                    <Lightbulb size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span>{suggestion}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Missing Keywords */}
                {analysis!.missingKeywords.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ margin: '0 0 8px', fontSize: '11px', textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.5px' }}>
                            Missing Keywords ({analysis!.missingKeywords.length})
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {analysis!.missingKeywords.map((kw, i) => (
                                <span key={i} style={{
                                    padding: '4px 8px', borderRadius: '12px',
                                    backgroundColor: '#fef2f2', color: '#dc2626',
                                    border: '1px solid #fee2e2', fontSize: '11px', fontWeight: 500
                                }}>
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Matched Keywords */}
                <div>
                    <h4 style={{ margin: '0 0 8px', fontSize: '11px', textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.5px' }}>
                        Matched Keywords ({analysis!.matchedKeywords.length})
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {analysis!.matchedKeywords.map((kw, i) => (
                            <span key={i} style={{
                                padding: '4px 8px', borderRadius: '12px',
                                backgroundColor: '#f0fdf4', color: '#16a34a',
                                border: '1px solid #bbf7d0', fontSize: '11px', fontWeight: 500
                            }}>
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
