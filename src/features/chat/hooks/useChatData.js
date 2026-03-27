import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { chatApi } from '../services/chatApi';
import { toast } from 'sonner';
import { socket } from '@/api/socketClient';

export function useChatData(selectedConversationId) {
    const queryClient = useQueryClient();
    const { user: rawUser } = useAuth();

    const myId = rawUser?.companyId || rawUser?.company_id || rawUser?.id;

    // We map 'user' for ChatArea backwards-compatibility with 'user.email'
    const user = { ...rawUser, email: myId };

    // Room Join/Leave and Listeners
    useEffect(() => {
        if (!socket || !selectedConversationId) return;

        socket.emit('join_conversation', selectedConversationId);
        socket.emit('mark_read', { conversation_id: selectedConversationId });

        const handleNewMessage = (msg) => {
            queryClient.setQueryData(['mensajes', selectedConversationId], (oldData) => {
                if (!oldData) return { data: [msg] };
                const prevItems = Array.isArray(oldData) ? oldData : oldData.data || [];
                if (prevItems.some(item => item.id === msg.id)) return oldData;
                return { ...oldData, data: [...prevItems, msg] }; // Agregamos al final (más reciente)
            });
            queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
            
            // Mark as read immediately if we are actively viewing this chat
            socket.emit('mark_read', { conversation_id: selectedConversationId });
        };

        const handleConversationRead = () => {
             queryClient.invalidateQueries({ queryKey: ['mensajes', selectedConversationId] });
        };

        socket.on('receive_message', handleNewMessage);
        socket.on('conversation_read', handleConversationRead);

        return () => {
             socket.off('receive_message', handleNewMessage);
             socket.off('conversation_read', handleConversationRead);
             socket.emit('leave_conversation', selectedConversationId);
        };
    }, [selectedConversationId, queryClient]);

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
        contenido: msg.content,
        archivo_adjunto_url: msg.file_url,
        leido: msg.is_read,
        created_date: msg.created_at,
    }));

    const sendMutation = useMutation({
        mutationFn: async ({ contenido, archivo, selectedConversation }) => {
            return new Promise((resolve, reject) => {
                try {
                    let archivo_adjunto_url = null;
                    if (archivo) {
                        // TODO: Re-connect real S3 upload service logic
                        // For now we skip or log standard errors if an attachment is placed
                        console.warn("Adjuntos aún no implementados en el nuevo socket");
                    }

                    const payload = {
                        conversation_id: selectedConversation.id,
                        client_msg_id: crypto.randomUUID(),
                        content: contenido,
                        file_url: archivo_adjunto_url,
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
