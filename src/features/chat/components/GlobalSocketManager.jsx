import { useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { socket } from '@/api/socketClient';
import { useQueryClient } from '@tanstack/react-query';
import { CHAT_SOCKET_EVENTS, normalizeStatePayload } from '../socket/chatSocketEvents';
import { updateConversationsCache } from '../socket/chatCacheUpdater';
import { showToastForEvent } from '../socket/chatToastPolicy';

export default function GlobalSocketManager() {
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const recentEventsRef = useRef(new Set());

    useEffect(() => {
        if (!isAuthenticated || !user || !socket) return;

        const myCompanyId = user.companyId || user.company_id || user.id;
        
        // This relies on the backend broadcasting `emit` to `company_${myCompanyId}`
        // specifically for cross-session/cross-view notifications!

        const handleGlobalStateUpdate = (rawPayload) => {
            const payload = normalizeStatePayload(rawPayload);

            // Deduplicate incoming events
            const eventHash = `${payload.action}-${payload.quote_response_id || payload.transaction_id}-${payload.timestamp}`;
            if (recentEventsRef.current.has(eventHash)) {
                return; // Duplicate event skipped
            }
            recentEventsRef.current.add(eventHash);

            // Keep set size manageable
            if (recentEventsRef.current.size > 50) {
                const iterator = recentEventsRef.current.values();
                recentEventsRef.current.delete(iterator.next().value);
            }

            // Patch cache first
            const wasPatched = updateConversationsCache(queryClient, payload);
            
            // Re-fetch specific items if payload knows what changed
            if (payload.quote_response_id) {
                queryClient.invalidateQueries({ queryKey: ['quote-responses'] });
                queryClient.invalidateQueries({ queryKey: ['quote-response-detail', payload.quote_response_id] });
            }
            if (payload.transaction_id) {
                queryClient.invalidateQueries({ queryKey: ['transaction-detail', payload.transaction_id] });
            }

            // Fallback invalidation if patch failed or payload lacks necessary IDs for a patch
            if (!wasPatched) {
                queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
            }

            // Apply toast policy
            showToastForEvent(payload, myCompanyId);
        };

        // Attach global listeners
        CHAT_SOCKET_EVENTS.STATE_EVENTS.forEach(evt => socket.on(evt, handleGlobalStateUpdate));

        return () => {
            CHAT_SOCKET_EVENTS.STATE_EVENTS.forEach(evt => socket.off(evt, handleGlobalStateUpdate));
        };
    }, [isAuthenticated, user, queryClient]);

    return null; // This is a headless component, purely for logic!
}
