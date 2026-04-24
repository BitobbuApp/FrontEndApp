import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { chatApi } from '../services/chatApi';
import { toast } from 'sonner';
import { socket } from '@/api/socketClient';
import { CHAT_SOCKET_EVENTS, normalizeStatePayload } from '../socket/chatSocketEvents';
import { patchMessageIntoCache, updateConversationLastMessage } from '../socket/chatCacheUpdater';
import { useRef } from 'react';

export function useChatData(selectedConversationId) {
    const queryClient = useQueryClient();
    const { user: rawUser } = useAuth();
    const markReadTimeoutRef = useRef(null);

    const myId = rawUser?.companyId || rawUser?.company_id || rawUser?.id;

    // We map 'user' for ChatArea backwards-compatibility with 'user.email'
    const user = { ...rawUser, email: myId };

    // Room Join/Leave and Listeners
    useEffect(() => {
        if (!socket || !selectedConversationId) return;

        socket.emit(CHAT_SOCKET_EVENTS.JOIN_CONVERSATION, selectedConversationId);
        socket.emit(CHAT_SOCKET_EVENTS.MARK_READ, { conversation_id: selectedConversationId });

        const debouncedMarkRead = () => {
            if (markReadTimeoutRef.current) clearTimeout(markReadTimeoutRef.current);
            markReadTimeoutRef.current = setTimeout(() => {
                socket.emit(CHAT_SOCKET_EVENTS.MARK_READ, { conversation_id: selectedConversationId });
            }, 1000);
        };

        const handleNewMessage = (msg) => {
            patchMessageIntoCache(queryClient, selectedConversationId, msg);
            updateConversationLastMessage(queryClient, selectedConversationId, msg, msg.sender_id === myId);
            
            // Mark as read immediately if we are actively viewing this chat, but debounced to avoid spam
            debouncedMarkRead();
        };

        const handleConversationRead = () => {
             // Optional: update UI to show messages are read
             queryClient.invalidateQueries({ queryKey: ['mensajes', selectedConversationId] });
        };

        const handleReconnect = () => {
            // Re-fetch messages and conversation list to backfill any events missed while disconnected
            queryClient.invalidateQueries({ queryKey: ['mensajes', selectedConversationId] });
            queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
        };

        socket.on(CHAT_SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
        socket.on(CHAT_SOCKET_EVENTS.CONVERSATION_READ, handleConversationRead);
        socket.on('reconnect', handleReconnect);

        return () => {
             socket.off(CHAT_SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
             socket.off(CHAT_SOCKET_EVENTS.CONVERSATION_READ, handleConversationRead);
             socket.off('reconnect', handleReconnect);
             socket.emit(CHAT_SOCKET_EVENTS.LEAVE_CONVERSATION, selectedConversationId);
             if (markReadTimeoutRef.current) clearTimeout(markReadTimeoutRef.current);
        };
    }, [selectedConversationId, queryClient, myId]);

    const { data: convResp, isLoading: loadingConversations } = useQuery({
        queryKey: ['conversaciones'], // Automatic context for myId based on JWT token
        queryFn: () => chatApi.getConversations(),
        enabled: !!myId,
    });

    // Safely unwrap data depending on interceptor behavior
    const rawConvs = Array.isArray(convResp) ? convResp : (convResp?.data || []);

    // Map backend Conversation to Base44 format expected by UI
    const conversaciones = rawConvs.map((conv) => ({
        id: conv.id,
        status: conv.status,
        quote_response_id: conv.quote_response_id,
        transaction_id: conv.transaction_id,
        participante_1_id: conv.participant_1_id,
        participante_2_id: conv.participant_2_id,
        participante_1_nombre: conv.participant_1?.trade_name,
        participante_1_logo: conv.participant_1?.logo_url,
        participante_2_nombre: conv.participant_2?.trade_name,
        participante_2_logo: conv.participant_2?.logo_url,
        ultimo_mensaje: conv.last_message,
        fecha_ultimo_mensaje: conv.last_message_date,
        mensajes_no_leidos_1: conv.unread_count_1,
        mensajes_no_leidos_2: conv.unread_count_2,
        request: conv.request ? {
            product_service: conv.request.product_service,
            quantity: conv.request.quantity,
            unit: conv.request.unit_of_measure?.abbreviation,
        } : null,
        quote_response: conv.quote_response ? {
            price: conv.quote_response.unit_price_usd,
            quantity: conv.quote_response.quantity,
        } : null,
    }));

    const { data: msgResp, isLoading: loadingMessages } = useQuery({
        queryKey: ['mensajes', selectedConversationId],
        queryFn: () => chatApi.getMessages(selectedConversationId),
        enabled: !!selectedConversationId,
        // Polling removed: Sockets are now pushing changes!
    });

    // Safely unwrap depending on interceptor
    const rawMsgs = Array.isArray(msgResp) ? msgResp : (msgResp?.data || []);

    // El backend envía el historial en orden Ascendente (el más viejo primero), 
    // lo mantendremos así para que los mensajes rendericen de arriba hacia abajo cronológicamente
    const mensajes = [...rawMsgs].map((msg) => ({
        id: msg.id,
        remitente_id: msg.sender_id,
        message_type: msg.message_type || 'user',
        event_key: msg.event_key,
        event_payload: msg.event_payload,
        contenido: msg.content,
        archivo_adjunto_url: msg.file_url,
        leido: msg.is_read,
        created_date: msg.created_at,
    }));

    const sendMutation = useMutation({
        mutationFn: async ({ contenido, archivo, selectedConversation }) => {
            return new Promise(async (resolve, reject) => {
                try {
                    let archivo_adjunto_url = null;
                    let archivo_name = null;
                    
                    if (archivo) {
                        const fd = new FormData();
                        fd.append('file', archivo);
                        const uploadRes = await chatApi.uploadFile(fd);
                        // Dependiendo de cómo mapea el interceptor, puede estar en data o data.data
                        archivo_adjunto_url = uploadRes.data?.file_url || uploadRes.file_url;
                        archivo_name = uploadRes.data?.file_name || uploadRes.file_name;
                    }

                    const payload = {
                        conversation_id: selectedConversation.id,
                        client_msg_id: crypto.randomUUID(),
                        content: contenido,
                        file_url: archivo_adjunto_url,
                        file_name: archivo_name
                    };

                    socket.emit('send_message', payload, (response) => {
                        if (response?.status === 'success') {
                            resolve(response.data);
                        } else {
                            reject(new Error(response?.message || 'Error occurred'));
                        }
                    });
                } catch (err) {
                    reject(err);
                }
            });
        },
        onSuccess: (newMessage) => {
            queryClient.setQueryData(['mensajes', selectedConversationId], (oldData) => {
                const prevItems = Array.isArray(oldData) ? oldData : oldData?.data || [];
                if (prevItems.some(item => item.id === newMessage.id)) return oldData;
                return { ...oldData, data: [...prevItems, newMessage] }; // Agregamos al final
            });
            queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
        },
        onError: (err) => {
            console.error('Socket send error:', err);
            toast.error('Error al enviar mensaje', {
                description: err.message
            });
        },
    });

    const getOtherParticipant = (conv) => {
        if (!conv) return {};
        if (conv.participante_1_id === myId) {
            return {
                id: conv.participante_2_id,
                nombre: conv.participante_2_nombre || 'Usuario', // Added fallback to prevent undefined issues in filters
                logo: conv.participante_2_logo,
            };
        }
        return {
            id: conv.participante_1_id,
            nombre: conv.participante_1_nombre || 'Usuario',
            logo: conv.participante_1_logo,
        };
    };

    const getUnreadCount = (conv) => {
        if (!conv) return 0;
        if (conv.participante_1_id === myId) {
            return conv.mensajes_no_leidos_1 || 0;
        }
        return conv.mensajes_no_leidos_2 || 0;
    };

    return {
        user, // user.email acts as myId for ChatArea
        conversaciones,
        mensajes,
        loadingConversations,
        loadingMessages,
        sendMutation,
        getOtherParticipant,
        getUnreadCount,
    };
}

