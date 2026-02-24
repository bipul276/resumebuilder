import { useSandboxStore } from '../../stores/useSandboxStore';
import { useState, useEffect, useMemo } from 'react';
import { useTier } from '../../contexts/TierContext';
import { LockedFeaturePanel } from '../common/LockedFeaturePanel';
import { ATSAnalysis, ATSWarning } from '@resumebuilder/shared';
import { analyzeForATS, getScoreColor, getScoreLabel, getSeverityColor, getCategoryLabel } from '../../utils/atsAnalyzer';
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    AlertTriangle,
    AlertCircle,
    Info,
    FileText,
    ChevronDown,
    ChevronRight,
    Eye,
    EyeOff,
    Download,
    RefreshCw,
    Copy,
    Check,
} from 'lucide-react';

export function ATSModePanel() {
    const { tier } = useTier();
    const { data, selectedIds, selectElement } = useSandboxStore();
    const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);

    if (tier === 'free') {
        return <LockedFeaturePanel feature="Advanced ATS Analysis" tier="Pro" description="Get detailed feedback on your resume's ATS compatibility and keyword optimization." />;
    }
    const [showText, setShowText] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [copied, setCopied] = useState(false);

    // Run analysis when elements change
    useEffect(() => {
        const result = analyzeForATS(data.elements);
        setAnalysis(result);
    }, [data.elements]);

    // Group warnings by category
    const warningsByCategory = useMemo(() => {
        if (!analysis) return {};
        return analysis.warnings.reduce((acc, warning) => {
            if (!acc[warning.category]) acc[warning.category] = [];
            acc[warning.category].push(warning);
            return acc;
        }, {} as Record<string, ATSWarning[]>);
    }, [analysis]);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const copyText = () => {
        if (analysis?.extractedText) {
            navigator.clipboard.writeText(analysis.extractedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Get shield icon based on score
    const getShieldIcon = (score: number) => {
        if (score >= 80) return <ShieldCheck size={48} color="#16a34a" />;
        if (score >= 60) return <Shield size={48} color="#ca8a04" />;
        if (score >= 40) return <ShieldAlert size={48} color="#ea580c" />;
        return <ShieldX size={48} color="#dc2626" />;
    };

    // Get severity icon
    const getSeverityIcon = (severity: 'error' | 'warning' | 'info') => {
        switch (severity) {
            case 'error': return <AlertCircle size={14} color="#dc2626" />;
            case 'warning': return <AlertTriangle size={14} color="#ca8a04" />;
            case 'info': return <Info size={14} color="#2563eb" />;
        }
    };

    if (!analysis) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                <RefreshCw size={24} className="animate-spin" />
                <p>Analyzing...</p>
            </div>
        );
    }

    return (
        <div style={{ fontSize: '13px' }}>
            {/* Score Card */}
            <div style={{
                background: analysis.isDraft
                    ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '16px',
                border: `1px solid ${analysis.isDraft ? '#fcd34d' : '#e2e8f0'}`,
            }}>
                <div style={{ marginBottom: '12px' }}>
                    {analysis.isDraft ? (
                        <Shield size={48} color="#ca8a04" />
                    ) : (
                        getShieldIcon(analysis.score!)
                    )}
                </div>

                {analysis.isDraft ? (
                    <>
                        <div style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#92400e',
                            lineHeight: 1.3,
                        }}>
                            Draft Mode
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: '#a16207',
                            marginTop: '8px',
                            lineHeight: 1.4,
                        }}>
                            Add more content to calculate your ATS score
                        </div>
                        <div style={{
                            marginTop: '12px',
                            padding: '8px 16px',
                            backgroundColor: '#fef3c7',
                            borderRadius: '20px',
                            display: 'inline-block',
                            fontSize: '11px',
                            color: '#92400e',
                            fontWeight: 500,
                        }}>
                            {analysis.wordCount} / {analysis.minWordsRequired} words minimum
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{
                            fontSize: '36px',
                            fontWeight: 700,
                            color: getScoreColor(analysis.score!),
                            lineHeight: 1,
                        }}>
                            {analysis.score}
                        </div>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: getScoreColor(analysis.score!),
                            marginTop: '4px',
                        }}>
                            {getScoreLabel(analysis.score!)}
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            marginTop: '8px',
                        }}>
                            ATS Compatibility Score
                        </div>
                    </>
                )}
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                marginBottom: '16px',
            }}>
                <div style={{
                    background: '#fef2f2',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#dc2626' }}>
                        {analysis.warnings.filter(w => w.severity === 'error').length}
                    </div>
                    <div style={{ fontSize: '10px', color: '#dc2626' }}>Errors</div>
                </div>
                <div style={{
                    background: '#fefce8',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#ca8a04' }}>
                        {analysis.warnings.filter(w => w.severity === 'warning').length}
                    </div>
                    <div style={{ fontSize: '10px', color: '#ca8a04' }}>Warnings</div>
                </div>
                <div style={{
                    background: '#eff6ff',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#2563eb' }}>
                        {analysis.warnings.filter(w => w.severity === 'info').length}
                    </div>
                    <div style={{ fontSize: '10px', color: '#2563eb' }}>Info</div>
                </div>
            </div>

            {/* Keyword Density */}
            {analysis.keywordDensity && analysis.keywordDensity.topKeywords.length > 0 && (
                <div style={{
                    marginBottom: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '10px 12px',
                        background: '#f9fafb',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#374151',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <span>📊 Keyword Density</span>
                        <span style={{ fontWeight: 400, color: '#6b7280' }}>
                            {analysis.keywordDensity.uniqueWords} unique words
                        </span>
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                        {analysis.keywordDensity.topKeywords.slice(0, 6).map((kw, i) => (
                            <div key={kw.word} style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: i < 5 ? '6px' : 0,
                                gap: '8px',
                            }}>
                                <div style={{
                                    width: '80px',
                                    fontSize: '11px',
                                    color: '#374151',
                                    fontWeight: 500,
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {kw.word}
                                </div>
                                <div style={{
                                    flex: 1,
                                    height: '6px',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min(kw.density * 10, 100)}%`,
                                        backgroundColor: i < 3 ? '#2563eb' : '#93c5fd',
                                        borderRadius: '3px',
                                    }} />
                                </div>
                                <div style={{
                                    fontSize: '10px',
                                    color: '#6b7280',
                                    width: '35px',
                                    textAlign: 'right',
                                }}>
                                    {kw.density}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Warnings by Category */}
            {Object.keys(warningsByCategory).length > 0 ? (
                <div style={{ marginBottom: '16px' }}>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#6b7280',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        Issues Found
                    </div>
                    {Object.entries(warningsByCategory).map(([category, warnings]) => (
                        <div
                            key={category}
                            style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                marginBottom: '8px',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                onClick={() => toggleCategory(category)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 12px',
                                    background: '#f9fafb',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{getCategoryLabel(category)}</span>
                                    <span style={{
                                        fontSize: '10px',
                                        background: '#e5e7eb',
                                        padding: '2px 6px',
                                        borderRadius: '10px',
                                    }}>
                                        {warnings.length}
                                    </span>
                                </div>
                                {expandedCategories[category] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </div>
                            {expandedCategories[category] && (
                                <div style={{ padding: '8px' }}>
                                    {warnings.map((warning) => (
                                        <div
                                            key={warning.id}
                                            onClick={() => warning.elementId && selectElement(warning.elementId)}
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                                padding: '8px',
                                                background: '#ffffff',
                                                borderRadius: '6px',
                                                marginBottom: '4px',
                                                cursor: warning.elementId ? 'pointer' : 'default',
                                                border: `1px solid ${getSeverityColor(warning.severity)}20`,
                                            }}
                                        >
                                            {getSeverityIcon(warning.severity)}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '12px', color: '#374151', marginBottom: '2px' }}>
                                                    {warning.message}
                                                </div>
                                                <div style={{ fontSize: '10px', color: '#6b7280' }}>
                                                    💡 {warning.suggestion}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    marginBottom: '16px',
                    border: '1px solid #bbf7d0',
                }}>
                    <ShieldCheck size={24} color="#16a34a" style={{ marginBottom: '8px' }} />
                    <div style={{ color: '#16a34a', fontWeight: 500 }}>No issues found!</div>
                    <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '4px' }}>
                        Your resume is ATS-friendly
                    </div>
                </div>
            )}

            {/* Text Preview */}
            <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
                <div
                    onClick={() => setShowText(!showText)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: '#f9fafb',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={14} color="#6b7280" />
                        <span style={{ fontWeight: 500, color: '#374151' }}>Extracted Text</span>
                        <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                            {analysis.wordCount} words
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); copyText(); }}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: '#6b7280',
                                padding: '4px',
                            }}
                            title="Copy text"
                        >
                            {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                        </button>
                        {showText ? <EyeOff size={14} /> : <Eye size={14} />}
                    </div>
                </div>
                {showText && (
                    <div style={{
                        padding: '12px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        fontSize: '11px',
                        lineHeight: 1.6,
                        color: '#374151',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        background: '#ffffff',
                    }}>
                        {analysis.extractedText || 'No text content found'}
                    </div>
                )}
            </div>

            {/* ATS Tips */}
            <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                }}>
                    <ShieldCheck size={14} color="#16a34a" />
                    <span style={{ fontWeight: 600, color: '#166534', fontSize: '12px' }}>ATS Best Practices</span>
                </div>
                <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    color: '#166534',
                    fontSize: '11px',
                    lineHeight: 1.6,
                }}>
                    <li>Use standard section headings (Experience, Education, Skills)</li>
                    <li>Stick to single-column layouts when possible</li>
                    <li>Use ATS-safe fonts (Arial, Calibri, Times New Roman)</li>
                    <li>Include keywords from the job description</li>
                    <li>Avoid tables, text boxes, and graphics for critical info</li>
                </ul>
            </div>
        </div>
    );
}
