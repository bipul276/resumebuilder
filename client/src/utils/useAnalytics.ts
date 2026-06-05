import { useCallback } from 'react';
import axios from 'axios';

/**
 * Anonymous analytics hook.
 * 
 * Uses the resume's built-in `resumeId` (UUID v4) for tracking.
 * The resumeId lives inside the Zustand store and travels with JSON exports,
 * so analytics stay consolidated even across devices when a user imports their file.
 * 
 * No authentication required — fully anonymous.
 */

const API_URL = import.meta.env.VITE_API_URL || '';

export function useAnalytics(resumeId: string | undefined) {
    const trackEvent = useCallback((eventType: string, metadata: Record<string, unknown> = {}) => {
        if (!resumeId) return;

        axios.post(`${API_URL}/api/analytics/track-anon`, {
            anon_id: resumeId,
            event_type: eventType,
            metadata,
        }).catch((err) => console.error('Failed to track event:', err));
    }, [resumeId]);

    return { trackEvent };
}
