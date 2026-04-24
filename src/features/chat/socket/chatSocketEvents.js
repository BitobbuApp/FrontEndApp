export const CHAT_SOCKET_EVENTS = {
    // Room / messages
    JOIN_CONVERSATION: 'join_conversation',
    LEAVE_CONVERSATION: 'leave_conversation',
    MARK_READ: 'mark_read',
    SEND_MESSAGE: 'send_message',
    RECEIVE_MESSAGE: 'receive_message',
    CONVERSATION_READ: 'conversation_read',

    // Business states
    STATE_EVENTS: [
        'quote:negotiation_started', 'quote:updated', 'quote:formal_requested',
        'quote:formal_attached', 'quote:formal_rejected', 'quote:accepted',
        'quote:canceled', 'quote:expired',
        'transaction:payment_uploaded', 'transaction:payment_approved',
        'transaction:payment_rejected', 'transaction:order_shipped',
        'transaction:delivery_confirmed', 'transaction:canceled', 'transaction:dispute_raised',
        'review:submitted'
    ]
};

const SAFE_CONVERSATION_STATUSES = new Set([
    'active',
    'completed',
    'pending_review',
    'canceled',
    'expired'
]);

const coerceConversationStatus = (payload) => {
    if (payload?.conversation_status) return payload.conversation_status;
    const genericStatus = payload?.status;
    return SAFE_CONVERSATION_STATUSES.has(genericStatus) ? genericStatus : null;
};

export const normalizeStatePayload = (payload, sourceEvent = null) => {
    return {
        conversation_id: payload?.conversation_id || null,
        quote_response_id: payload?.quote_response_id || null,
        transaction_id: payload?.transaction_id || null,
        action: payload?.action || null,
        actor_company_id: payload?.actor_company_id || null,
        timestamp: payload?.timestamp || '', // Avoid Date.now() so duplicate raw payloads yield the same hash
        source_event: sourceEvent,
        transaction_status: payload?.transaction_status || payload?.status || null,
        conversation_status: coerceConversationStatus(payload)
    };
};
