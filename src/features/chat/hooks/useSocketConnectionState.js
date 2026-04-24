import { useState, useEffect } from 'react';
import { socket, isSocketConnected } from '@/api/socketClient';

export function useSocketConnectionState() {
    const [status, setStatus] = useState(isSocketConnected() ? 'connected' : 'offline');

    useEffect(() => {
        if (!socket) return;

        const onConnect = () => setStatus('connected');
        const onDisconnect = () => setStatus('offline');
        const onReconnectAttempt = () => setStatus('reconnecting');
        const onReconnect = () => setStatus('connected');

        // Initial sync
        if (socket.connected) {
            setStatus('connected');
        } else if (socket.active) {
            setStatus('reconnecting');
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('reconnect_attempt', onReconnectAttempt);
        socket.on('reconnect', onReconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('reconnect_attempt', onReconnectAttempt);
            socket.off('reconnect', onReconnect);
        };
    }, []);

    return status; // 'connected' | 'reconnecting' | 'offline'
}
