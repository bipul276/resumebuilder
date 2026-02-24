/**
 * User Tier Context
 * Provides tier-based feature gating throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type UserTier = 'free' | 'pro' | 'pro_plus';

interface TierContextType {
    tier: UserTier;
    setTier: (tier: UserTier) => void;
    isPro: boolean;
    isProPlus: boolean;
    canAccess: (feature: FeatureKey) => boolean;
}

// Feature definitions with tier requirements
export type FeatureKey =
    | 'rulers'
    | 'snap_grid'
    | 'layers'
    | 'ats_score'
    | 'jd_matching'
    | 'versions'
    | 'export_docx'
    | 'export_no_watermark'
    | 'custom_watermark'
    | 'keyword_density'
    | 'bullet_strength'
    | 'unlimited_docs';

const FEATURE_TIERS: Record<FeatureKey, UserTier> = {
    rulers: 'pro',
    snap_grid: 'pro',
    layers: 'pro',
    ats_score: 'pro',
    jd_matching: 'pro',
    versions: 'pro',
    export_docx: 'pro',
    export_no_watermark: 'pro',
    custom_watermark: 'pro_plus',
    keyword_density: 'pro',
    bullet_strength: 'pro',
    unlimited_docs: 'pro_plus',
};

const TierContext = createContext<TierContextType | undefined>(undefined);

export function TierProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [tier, setTier] = useState<UserTier>('free');

    // Sync tier with authenticated user
    useEffect(() => {
        if (user?.tier) {
            setTier(user.tier);
        } else {
            setTier('free');
        }
    }, [user]);

    const isPro = tier === 'pro' || tier === 'pro_plus';
    const isProPlus = tier === 'pro_plus';

    const canAccess = (feature: FeatureKey): boolean => {
        const requiredTier = FEATURE_TIERS[feature];
        if (requiredTier === 'free') return true;
        if (requiredTier === 'pro') return isPro;
        if (requiredTier === 'pro_plus') return isProPlus;
        return true;
    };

    return (
        <TierContext.Provider value={{ tier, setTier, isPro, isProPlus, canAccess }}>
            {children}
        </TierContext.Provider>
    );
}

export function useTier(): TierContextType {
    const context = useContext(TierContext);
    if (!context) {
        // Return default values if not wrapped in provider
        return {
            tier: 'pro',
            setTier: () => { },
            isPro: true,
            isProPlus: false,
            canAccess: () => true,
        };
    }
    return context;
}

// Feature lock badge component
export function ProBadge({ feature, children }: { feature?: FeatureKey; children: ReactNode }) {
    const { canAccess } = useTier();

    if (feature && !canAccess(feature)) {
        return (
            <div style={{ position: 'relative', opacity: 0.6, pointerEvents: 'none' }}>
                {children}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: 'white',
                    fontSize: '8px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '0 8px 0 8px',
                }}>
                    PRO
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

// Lock icon for locked features
export function LockIcon({ size = 12 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}
