import { useMemo } from 'react';
import { useSandboxStore } from '../../stores/useSandboxStore';
import { SandboxElement } from '@resumebuilder/shared';
import { Lightbulb, Zap, TrendingUp, Award, Star } from 'lucide-react';
import { analyzeBullet, renderStars } from '../../utils/bulletStrength';

// Weak verbs to strong alternatives
const VERB_SUGGESTIONS: Record<string, string[]> = {
    'helped': ['Led', 'Facilitated', 'Enabled'],
    'worked': ['Executed', 'Delivered', 'Managed'],
    'was responsible for': ['Owned', 'Directed', 'Oversaw'],
    'assisted': ['Collaborated', 'Supported', 'Contributed'],
    'participated in': ['Drove', 'Shaped', 'Influenced'],
    'handled': ['Managed', 'Resolved', 'Processed'],
    'did': ['Achieved', 'Completed', 'Executed'],
    'made': ['Created', 'Developed', 'Designed'],
    'used': ['Leveraged', 'Applied', 'Utilized'],
};

interface Suggestion {
    id: string;
    icon: any;
    color: string;
    title: string;
    description: string;
    action?: string;
}

function analyzeElement(element: SandboxElement): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const content = element.content?.toLowerCase() || '';

    // Check for weak verbs
    for (const [weak, alternatives] of Object.entries(VERB_SUGGESTIONS)) {
        if (content.includes(weak)) {
            suggestions.push({
                id: `weak-verb-${weak}`,
                icon: Zap,
                color: '#f59e0b',
                title: 'Strengthen this verb',
                description: `Replace "${weak}" with: ${alternatives.join(', ')}`,
                action: alternatives[0],
            });
            break; // Only show first suggestion
        }
    }

    // Check for missing quantification
    const hasNumbers = /\d+/.test(element.content || '');
    const hasBullets = element.content?.includes('•') || element.content?.includes('-');
    if (hasBullets && !hasNumbers && element.content && element.content.length > 30) {
        suggestions.push({
            id: 'quantify',
            icon: TrendingUp,
            color: '#2563eb',
            title: 'Add metrics',
            description: 'Quantify your impact with numbers (%, $, count)',
        });
    }

    // Check for generic descriptions
    const genericPhrases = ['responsible for', 'duties included', 'tasks involved'];
    for (const phrase of genericPhrases) {
        if (content.includes(phrase)) {
            suggestions.push({
                id: 'generic',
                icon: Award,
                color: '#7c3aed',
                title: 'Be specific',
                description: 'Focus on achievements, not just responsibilities',
            });
            break;
        }
    }

    return suggestions.slice(0, 2); // Max 2 suggestions
}

export function InlineSuggestions() {
    const { data, selectedIds } = useSandboxStore();

    const selectedElement = useMemo(() => {
        if (selectedIds.length !== 1) return null;
        return data.elements.find(el => el.id === selectedIds[0] && el.type === 'text');
    }, [data.elements, selectedIds]);

    const suggestions = useMemo(() => {
        if (!selectedElement) return [];
        return analyzeElement(selectedElement);
    }, [selectedElement]);

    const bulletScore = useMemo(() => {
        if (!selectedElement?.content || selectedElement.content.length < 20) return null;
        return analyzeBullet(selectedElement.content);
    }, [selectedElement]);

    if (!selectedElement || (suggestions.length === 0 && !bulletScore)) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '220px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            zIndex: 100,
        }}>
            <div style={{
                padding: '10px 12px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #fcd34d',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lightbulb size={14} color="#92400e" />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#92400e' }}>
                        Writing Tips
                    </span>
                </div>
                {bulletScore && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '10px', color: bulletScore.color }}>
                            {renderStars(bulletScore.score)}
                        </span>
                    </div>
                )}
            </div>

            {/* Bullet Score Card */}
            {bulletScore && (
                <div style={{
                    padding: '8px 10px',
                    margin: '8px',
                    background: `${bulletScore.color}10`,
                    borderRadius: '6px',
                    border: `1px solid ${bulletScore.color}30`,
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: bulletScore.color }}>
                            Bullet Strength: {bulletScore.label}
                        </span>
                        <span style={{ fontSize: '12px', color: bulletScore.color }}>
                            {bulletScore.score}/5
                        </span>
                    </div>
                    {bulletScore.issues.length > 0 && (
                        <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '4px' }}>
                            {bulletScore.issues[0]}
                        </div>
                    )}
                </div>
            )}

            <div style={{ padding: '8px' }}>
                {suggestions.map((suggestion) => {
                    const Icon = suggestion.icon;
                    return (
                        <div
                            key={suggestion.id}
                            style={{
                                padding: '8px 10px',
                                borderRadius: '6px',
                                marginBottom: '4px',
                                backgroundColor: `${suggestion.color}08`,
                                border: `1px solid ${suggestion.color}20`,
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '4px',
                            }}>
                                <Icon size={12} color={suggestion.color} />
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: suggestion.color,
                                }}>
                                    {suggestion.title}
                                </span>
                            </div>
                            <p style={{
                                margin: 0,
                                fontSize: '10px',
                                color: '#4b5563',
                                lineHeight: 1.4,
                            }}>
                                {suggestion.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

