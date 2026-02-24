import React, { useState } from 'react';
import { Sparkles, Loader2, Lock } from 'lucide-react';
import axios from 'axios';
import { useTier } from '../../contexts/TierContext';

interface AiAssistButtonProps {
    text: string;
    type: 'experience' | 'summary' | 'skills';
    context?: string;
    onImprove: (improvedText: string) => void;
    style?: React.CSSProperties;
}

export const AiAssistButton: React.FC<AiAssistButtonProps> = ({ text, type, context, onImprove, style }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { tier } = useTier();
    const isLocked = tier !== 'pro_plus';

    const handleImprove = async () => {
        if (isLocked) return;
        if (!text || text.length < 5) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/ai/improve`, {
                text,
                type,
                context
            }, { headers });

            if (response.data.improvedText) {
                onImprove(response.data.improvedText);
            }
        } catch (err) {
            console.error('AI Improve Error:', err);
            setError('Failed to improve text');
            // Clear error after 3 seconds
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block', ...style }}>
            <button
                type="button"
                onClick={handleImprove}
                disabled={loading || (!text || text.length < 5) && !isLocked || isLocked}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: isLocked ? 'rgba(156, 163, 175, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                    border: `1px solid ${isLocked ? 'rgba(156, 163, 175, 0.2)' : 'rgba(168, 85, 247, 0.2)'}`,
                    borderRadius: '16px',
                    color: isLocked ? '#9ca3af' : '#a855f7',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: isLocked ? 'not-allowed' : (loading ? 'wait' : 'pointer'),
                    transition: 'all 0.2s',
                    opacity: (!text || text.length < 5) && !isLocked ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                    if (!loading && !isLocked && text && text.length >= 5) {
                        e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!loading && !isLocked) {
                        e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
                    }
                }}
                title={isLocked ? "Upgrade to Pro+ to use AI Assist" : (text && text.length < 5 ? "Enter more text to improve" : "Improve with AI")}
            >
                {loading ? (
                    <Loader2 size={12} className="animate-spin" />
                ) : isLocked ? (
                    <Lock size={12} />
                ) : (
                    <Sparkles size={12} />
                )}
                {loading ? ' improving...' : ' AI Assist'}
            </button>

            {error && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    padding: '4px 8px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};
