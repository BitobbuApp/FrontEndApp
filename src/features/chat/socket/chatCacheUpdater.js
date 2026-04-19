/**
 * Updates the 'conversaciones' query cache list based on a state payload.
 */
export const updateConversationsCache = (queryClient, payload) => {
    if (!payload) return false;

    let wasPatched = false;
    const norm = (value) => (value == null ? null : String(value));
    const matchesById = (conv) => {
        const convId = norm(conv.id);
        const convTxId = norm(conv.transaction_id);
        const convQuoteId = norm(conv.quote_response_id);

        return (
            (payload.transaction_id != null && convTxId === norm(payload.transaction_id)) ||
            (payload.quote_response_id != null && convQuoteId === norm(payload.quote_response_id)) ||
            (payload.conversation_id != null && convId === norm(payload.conversation_id))
        );
    };

    queryClient.setQueryData(['conversaciones'], (oldData) => {
        if (!oldData) return oldData;

        const rawItems = Array.isArray(oldData) ? oldData : oldData?.data || [];
        const updatedItems = rawItems.map(conv => {
            if (matchesById(conv)) {

                wasPatched = true;
                return {
                    ...conv,
                    ...(payload.conversation_status ? { status: payload.conversation_status } : {}),
                    transaction_id: payload.transaction_id || conv.transaction_id
                };
            }
            return conv;
        });

        return Array.isArray(oldData) ? updatedItems : { ...oldData, data: updatedItems };
    });

    return wasPatched;
};

/**
 * Patches a new message into the specific conversation messages list.
 */
export const patchMessageIntoCache = (queryClient, conversationId, newMessage) => {
    queryClient.setQueryData(['mensajes', conversationId], (oldData) => {
        if (!oldData) return { data: [newMessage] };

        const prevItems = Array.isArray(oldData) ? oldData : oldData.data || [];

        // Deduplicate
        if (prevItems.some(item => item.id === newMessage.id || (newMessage.client_msg_id && item.client_msg_id === newMessage.client_msg_id))) {
             // Replace if we have a match, usually upgrading from optimistic to real
             const replaced = prevItems.map(item =>
                (item.id === newMessage.id || (newMessage.client_msg_id && item.client_msg_id === newMessage.client_msg_id))
                ? newMessage : item
             );
             return { ...oldData, data: replaced };
        }

        return { ...oldData, data: [...prevItems, newMessage] }; // Agregamos al final (más reciente)
    });
};

/**
 * Updates the last_message and unread counts for a conversation in the conversations list.
 */
export const updateConversationLastMessage = (queryClient, conversationId, newMessage, isOwnMessage) => {
    queryClient.setQueryData(['conversaciones'], (oldData) => {
         if (!oldData) return oldData;

         const rawItems = Array.isArray(oldData) ? oldData : oldData?.data || [];
         const updatedItems = rawItems.map(conv => {
             if (conv.id === conversationId) {
                 return {
                     ...conv,
                     ultimo_mensaje: newMessage.content,
                     fecha_ultimo_mensaje: newMessage.created_at,
                     // Increment unread count for the *other* person if it's not our own message
                     // Since we only know the raw counts, we don't know which is 1 or 2 reliably here
                     // So this is best-effort. If we need exact, we fallback to invalidation.
                 };
             }
             return conv;
         });

         return Array.isArray(oldData) ? updatedItems : { ...oldData, data: updatedItems };
    });
};
