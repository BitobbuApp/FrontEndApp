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

        const handleGlobalStateUpdate = (rawPayload, eventName) => {
            const payload = normalizeStatePayload(rawPayload, eventName);

            // Deduplicate incoming events
            const scopedId = payload.conversation_id || payload.quote_response_id || payload.transaction_id || 'no-id';
            const eventHash = [
                payload.source_event || 'no-event',
                payload.action || 'no-action',
                scopedId,
                payload.timestamp || 'no-ts'
            ].join('|');
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
            // Keep conversations in sync with backend truth without waiting for UI navigation.
            queryClient.invalidateQueries({ queryKey: ['conversaciones'], refetchType: 'active' });

            // Apply toast policy
            showToastForEvent(payload, myCompanyId);
        };

        // Attach global listeners
        const listeners = CHAT_SOCKET_EVENTS.STATE_EVENTS.map((evt) => {
            const listener = (rawPayload) => handleGlobalStateUpdate(rawPayload, evt);
            socket.on(evt, listener);
            return { evt, listener };
        });

        return () => {
            listeners.forEach(({ evt, listener }) => socket.off(evt, listener));
        };
    }, [isAuthenticated, user, queryClient]);

    return null; // This is a headless component, purely for logic!
}
