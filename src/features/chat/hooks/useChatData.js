import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useChatData(selectedConversationId) {
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
    });

    const { data: conversaciones = [], isLoading: loadingConversations } = useQuery({
        queryKey: ['conversaciones', user?.email],
        queryFn: async () => {
            const convs = await base44.entities.Conversacion.list('-fecha_ultimo_mensaje');
            return convs.filter(
                (c) => c.participante_1_id === user?.email || c.participante_2_id === user?.email
            );
        },
        enabled: !!user?.email,
    });

    const { data: mensajes = [], isLoading: loadingMessages } = useQuery({
        queryKey: ['mensajes', selectedConversationId],
        queryFn: () =>
            base44.entities.Mensaje.filter({ conversacion_id: selectedConversationId }, 'created_date'),
        enabled: !!selectedConversationId,
        refetchInterval: 3000,
    });

    const sendMutation = useMutation({
        mutationFn: async ({ contenido, archivo, selectedConversation }) => {
            let archivo_adjunto_url = null;
            if (archivo) {
                const { file_url } = await base44.integrations.Core.UploadFile({ file: archivo });
                archivo_adjunto_url = file_url;
            }

            const destinatario =
                selectedConversation.participante_1_id === user?.email
                    ? selectedConversation.participante_2_id
                    : selectedConversation.participante_1_id;

            await base44.entities.Mensaje.create({
                conversacion_id: selectedConversation.id,
                remitente_id: user.email,
                destinatario_id: destinatario,
                contenido,
                archivo_adjunto_url,
            });

            await base44.entities.Conversacion.update(selectedConversation.id, {
                ultimo_mensaje: contenido,
                fecha_ultimo_mensaje: new Date().toISOString(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mensajes'] });
            queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
        },
        onError: () => {
            toast.error('Error al enviar mensaje');
        },
    });

    const getOtherParticipant = (conv) => {
        if (!conv) return {};
        if (conv.participante_1_id === user?.email) {
            return {
                id: conv.participante_2_id,
                nombre: conv.participante_2_nombre,
                logo: conv.participante_2_logo,
            };
        }
        return {
            id: conv.participante_1_id,
            nombre: conv.participante_1_nombre,
            logo: conv.participante_1_logo,
        };
    };

    const getUnreadCount = (conv) => {
        if (!conv) return 0;
        if (conv.participante_1_id === user?.email) {
            return conv.mensajes_no_leidos_1 || 0;
        }
        return conv.mensajes_no_leidos_2 || 0;
    };

    return {
        user,
        conversaciones,
        mensajes,
        loadingConversations,
        loadingMessages,
        sendMutation,
        getOtherParticipant,
        getUnreadCount,
    };
}
