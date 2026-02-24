import { useSandboxStore } from '../../stores/useSandboxStore';
import { useState, useEffect, useMemo } from 'react';
import { useTier } from '../../contexts/TierContext';
import { LockedFeaturePanel } from '../common/LockedFeaturePanel';
import { ContentAnalysis, ContentIssue, ContentIssueCategory, analyzeContent, getCategoryIcon, getContentSeverityColor } from '../../utils/contentAnalyzer';
import {
    Lightbulb,
    AlertTriangle,
    AlertCircle,
    Info,
    ChevronDown,
    ChevronRight,
    RefreshCw,
    CheckCircle,
    TrendingUp,
    BarChart2,
    Target,
} from 'lucide-react';

export function ContentAssistPanel() {
    const { tier } = useTier();
    const { data, selectedIds, selectElement } = useSandboxStore();
    const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);

    if (tier !== 'pro_plus') {
        return <LockedFeaturePanel feature="AI Writing Assistant" tier="Pro+" description="Get AI-powered suggestions to improve your resume content and impact." />;
    }
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        bullets: true,
        verbs: true,
        density: false,
        spacing: false,
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Run analysis
    const runAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const result = analyzeContent(data.elements);
            setAnalysis(result);
            setIsAnalyzing(false);
        }, 100);
    };

    // Run on mount and when elements change significantly
    useEffect(() => {
        runAnalysis();
    }, [data.elements.length]);

    // Group issues by category
    const issuesByCategory = useMemo(() => {
        if (!analysis) return {};
        return analysis.issues.reduce((acc, issue) => {
            if (!acc[issue.category]) acc[issue.category] = [];
            acc[issue.category].push(issue);
            return acc;
        }, {} as Record<string, ContentIssue[]>);
    }, [analysis]);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    // Get severity icon
    const getSeverityIcon = (severity: 'error' | 'warning' | 'suggestion') => {
        switch (severity) {
            case 'error': return <AlertCircle size={14} color="#dc2626" />;
            case 'warning': return <AlertTriangle size={14} color="#ca8a04" />;
            case 'suggestion': return <Lightbulb size={14} color="#2563eb" />;
        }
    };

    // Category labels
    const categoryLabels: Record<ContentIssueCategory, string> = {
        bullets: 'Bullet Consistency',
        verbs: 'Action Verbs',
        density: 'Content Density',
        spacing: 'Spacing & Layout',
        structure: 'Structure',
    };

    if (isAnalyzing) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af' }}>
                <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '12px' }}>Analyzing content...</p>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                <button
                    onClick={runAnalysis}
                    style={{
                        padding: '10px 20px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '0 auto',
                    }}
                >
                    <Target size={16} />
                    Analyze Content
                </button>
            </div>
        );
    }

    const totalIssues = analysis.issues.length;
    const errorCount = analysis.issues.filter(i => i.severity === 'error').length;
    const warningCount = analysis.issues.filter(i => i.severity === 'warning').length;
    const suggestionCount = analysis.issues.filter(i => i.severity === 'suggestion').length;

    return (
        <div style={{ fontSize: '13px' }}>
            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '16px',
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid #bae6fd',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <BarChart2 size={14} color="#0284c7" />
                        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 500 }}>BULLETS</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#0c4a6e' }}>
                        {analysis.stats.bulletCount}
                    </div>
                    <div style={{ fontSize: '10px', color: '#0369a1' }}>
                        ~{analysis.stats.avgBulletLength} words avg
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid #fde047',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <TrendingUp size={14} color="#ca8a04" />
                        <span style={{ fontSize: '10px', color: '#ca8a04', fontWeight: 500 }}>WORDS</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#713f12' }}>
                        {analysis.stats.wordCount}
                    </div>
                    <div style={{ fontSize: '10px', color: '#a16207' }}>
                        {analysis.stats.denseSections > 0 ? `${analysis.stats.denseSections} dense` : 'Well balanced'}
                    </div>
                </div>
            </div>

            {/* Refresh Button */}
            <button
                onClick={runAnalysis}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '16px',
                }}
            >
                <RefreshCw size={14} />
                Re-analyze Content
            </button>

            {/* Issues Summary */}
            {totalIssues === 0 ? (
                <div style={{
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #bbf7d0',
                    marginBottom: '16px',
                }}>
                    <CheckCircle size={24} color="#16a34a" style={{ marginBottom: '8px' }} />
                    <div style={{ color: '#16a34a', fontWeight: 500 }}>Content looks great!</div>
                    <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '4px' }}>
                        No issues detected
                    </div>
                </div>
            ) : (
                <>
                    {/* Issue Counts */}
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '12px',
                    }}>
                        {errorCount > 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                background: '#fef2f2',
                                borderRadius: '12px',
                                fontSize: '11px',
                                color: '#dc2626',
                            }}>
                                <AlertCircle size={12} />
                                {errorCount}
                            </div>
                        )}
                        {warningCount > 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                background: '#fefce8',
                                borderRadius: '12px',
                                fontSize: '11px',
                                color: '#ca8a04',
                            }}>
                                <AlertTriangle size={12} />
                                {warningCount}
                            </div>
                        )}
                        {suggestionCount > 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                background: '#eff6ff',
                                borderRadius: '12px',
                                fontSize: '11px',
                                color: '#2563eb',
                            }}>
                                <Lightbulb size={12} />
                                {suggestionCount}
                            </div>
                        )}
                    </div>

                    {/* Issues by Category */}
                    {Object.entries(issuesByCategory).map(([category, issues]) => (
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
                                    <span>{getCategoryIcon(category as ContentIssueCategory)}</span>
                                    <span style={{ fontWeight: 500, color: '#374151' }}>
                                        {categoryLabels[category as ContentIssueCategory] || category}
                                    </span>
                                    <span style={{
                                        fontSize: '10px',
                                        background: '#e5e7eb',
                                        padding: '2px 6px',
                                        borderRadius: '10px',
                                    }}>
                                        {issues.length}
                                    </span>
                                </div>
                                {expandedCategories[category] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </div>

                            {expandedCategories[category] && (
                                <div style={{ padding: '8px' }}>
                                    {issues.map((issue) => (
                                        <div
                                            key={issue.id}
                                            onClick={() => selectElement(issue.elementId)}
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                                padding: '8px',
                                                background: '#ffffff',
                                                borderRadius: '6px',
                                                marginBottom: '4px',
                                                cursor: 'pointer',
                                                border: `1px solid ${getContentSeverityColor(issue.severity)}20`,
                                            }}
                                        >
                                            {getSeverityIcon(issue.severity)}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '12px', color: '#374151', marginBottom: '2px' }}>
                                                    {issue.message}
                                                </div>
                                                <div style={{ fontSize: '10px', color: '#6b7280' }}>
                                                    💡 {issue.suggestion}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}

            {/* Tips */}
            <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#faf5ff',
                borderRadius: '8px',
                border: '1px solid #e9d5ff',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                }}>
                    <Lightbulb size={14} color="#7c3aed" />
                    <span style={{ fontWeight: 600, color: '#6b21a8', fontSize: '12px' }}>Writing Tips</span>
                </div>
                <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    color: '#6b21a8',
                    fontSize: '11px',
                    lineHeight: 1.6,
                }}>
                    <li>Start bullets with strong action verbs</li>
                    <li>Keep bullets concise (15-30 words)</li>
                    <li>Quantify achievements when possible</li>
                    <li>Use consistent bullet style throughout</li>
                </ul>
            </div>
        </div>
    );
}
