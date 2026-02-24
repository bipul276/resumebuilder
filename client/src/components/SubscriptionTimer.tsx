import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useTier } from '../contexts/TierContext';

export function SubscriptionTimer() {
    const { tier } = useTier();
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        // Fetch user data to get expiry
        const fetchExpiry = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.user.tierExpiry) {
                        const expiry = new Date(data.user.tierExpiry);
                        const now = new Date();
                        const diffTime = expiry.getTime() - now.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        setDaysLeft(diffDays > 0 ? diffDays : 0);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch subscription status', err);
            }
        };

        if (tier !== 'free') {
            fetchExpiry();
        }
    }, [tier]);

    if (tier === 'free' || daysLeft === null) return null;

    // Determine color based on urgency
    const isUrgent = daysLeft <= 3;
    const color = isUrgent ? '#ff453a' : '#ff9f0a';
    const bgColor = isUrgent ? 'rgba(255, 69, 58, 0.1)' : 'rgba(255, 159, 10, 0.1)';

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: bgColor,
            border: `1px solid ${isUrgent ? 'rgba(255, 69, 58, 0.3)' : 'rgba(255, 159, 10, 0.3)'}`,
            marginLeft: '12px',
            fontSize: '11px',
            fontWeight: 500,
            color: color,
        }} title={`Your ${tier} plan expires in ${daysLeft} days`}>
            <Clock size={12} />
            Plan: {daysLeft} days left
        </div>
    );
}
