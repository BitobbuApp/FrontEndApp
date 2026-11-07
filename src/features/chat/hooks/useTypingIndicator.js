import { useState, useEffect, useRef, useCallback } from 'react';
import { socket } from '@/api/socketClient';
import { CHAT_SOCKET_EVENTS } from '../socket/chatSocketEvents';

// Emit "typing" at most every 2s, stop after 3s idle; the receiver expires the indicator after 5s without refresh
const EMIT_THROTTLE_MS = 2000;
const IDLE_STOP_MS = 3000;
const REMOTE_EXPIRE_MS = 5000;

/**
 * "Is typing" indicator for the open conversation (ephemeral, socket only).
 * Returns whether the other party is typing, plus the handlers for the local input.
 */
export function useTypingIndicator(conversationId, myId) {
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const isTypingRef = useRef(false);
    const lastEmitRef = useRef(0);
    const idleTimeoutRef = useRef(null);
    const remoteTimeoutRef = useRef(null);

    const emitTyping = useCallback((isTyping) => {
        if (!socket || !conversationId) return;
        socket.emit(CHAT_SOCKET_EVENTS.TYPING, { conversation_id: conversationId, is_typing: isTyping });
    }, [conversationId]);

    const stopTyping = useCallback(() => {
        clearTimeout(idleTimeoutRef.current);
        if (isTypingRef.current) {
            isTypingRef.current = false;
            lastEmitRef.current = 0;
            emitTyping(false);
        }
    }, [emitTyping]);

    const notifyTyping = useCallback(() => {
        const now = Date.now();
        if (!isTypingRef.current || now - lastEmitRef.current >= EMIT_THROTTLE_MS) {
            isTypingRef.current = true;
            lastEmitRef.current = now;
            emitTyping(true);
        }
        clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = setTimeout(stopTyping, IDLE_STOP_MS);
    }, [emitTyping, stopTyping]);

    // Listen to the other party's typing state for this conversation
    useEffect(() => {
        if (!socket || !conversationId) return;

        const hideRemote = () => {
            clearTimeout(remoteTimeoutRef.current);
            setIsOtherTyping(false);
        };

        const handleUserTyping = ({ conversation_id, company_id, is_typing }) => {
            if (conversation_id !== conversationId || company_id === myId) return;
            if (!is_typing) return hideRemote();

            setIsOtherTyping(true);
            clearTimeout(remoteTimeoutRef.current);
            remoteTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), REMOTE_EXPIRE_MS);
        };

        // The message arrived: the other party is no longer typing
        const handleNewMessage = (msg) => {
            if (msg?.conversation_id === conversationId && msg?.sender_id !== myId) hideRemote();
        };

        socket.on(CHAT_SOCKET_EVENTS.USER_TYPING, handleUserTyping);
        socket.on(CHAT_SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);

        return () => {
            socket.off(CHAT_SOCKET_EVENTS.USER_TYPING, handleUserTyping);
            socket.off(CHAT_SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
            hideRemote();
        };
    }, [conversationId, myId]);

    // Leaving the conversation (or unmounting) stops our own typing state
    useEffect(() => stopTyping, [stopTyping]);

    return { isOtherTyping, notifyTyping, stopTyping };
}
