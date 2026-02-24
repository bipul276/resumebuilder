import React from 'react';
import { Lock } from 'lucide-react';
import { useTier } from '../../contexts/TierContext';

interface LockedFeaturePanelProps {
    feature: string;
    tier: 'Pro' | 'Pro+';
    description?: string;
}

export const LockedFeaturePanel: React.FC<LockedFeaturePanelProps> = ({ feature, tier, description }) => {
    const { setTier } = useTier();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(243, 244, 246, 0) 0%, rgba(243, 244, 246, 0.5) 100%)',
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                maxWidth: '280px',
                backdropFilter: 'blur(8px)',
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: tier === 'Pro' ? '#dbeafe' : '#f3e8ff',
                    color: tier === 'Pro' ? '#2563eb' : '#9333ea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                }}>
                    <Lock size={24} />
                </div>

                <h3 style={{
                    margin: '0 0 8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111827',
                }}>
                    {feature}
                </h3>

                <p style={{
                    margin: '0 0 20px',
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: '1.5',
                }}>
                    {description || `Unlock this advanced feature by upgrading to the ${tier} plan.`}
                </p>

                <button
                    onClick={() => setTier(tier === 'Pro' ? 'pro' : 'pro_plus')}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: tier === 'Pro' ? '#2563eb' : '#9333ea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    Upgrade to {tier}
                </button>
            </div>
        </div>
    );
};
