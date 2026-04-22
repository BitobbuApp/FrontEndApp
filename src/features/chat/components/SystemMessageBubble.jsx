import { FileText } from 'lucide-react';

const SYSTEM_MESSAGES_DICTIONARY = {
    'chat.started': (payload, isMe) =>
        isMe ? 'Has iniciado la conversación.' : 'El usuario ha iniciado la conversación.',
    'quote.negotiating': (payload, isMe) => 
        isMe ? 'Has iniciado una negociación para esta cotización.' : 'El usuario ha iniciado una negociación.',
    'quote.price_updated': (payload, isMe) => 
        isMe ? `Has actualizado el precio unitario a $${payload?.unitPriceUsd?.toLocaleString()}` 
             : `El precio unitario ha sido actualizado a $${payload?.unitPriceUsd?.toLocaleString()}`,
    'quote.quantity_updated': (payload, isMe) => 
        isMe ? `Has actualizado la cantidad a ${payload?.quantity}` 
             : `La cantidad ha sido actualizada a ${payload?.quantity}`,
    'quote.terms_updated': (payload, isMe) => 
        isMe ? 'Has actualizado los términos o condiciones de pago.' 
             : 'Se han actualizado los términos y condiciones de la cotización.',
    'quote.formal_request': (payload, isMe) => 
        isMe ? 'Has solicitado la cotización formal en PDF.' 
             : 'Se ha solicitado la cotización formal en PDF.',
    'quote.formal_attached': (payload, isMe) => 
        isMe ? 'Has adjuntado la cotización formal en PDF.' 
             : 'Se ha adjuntado la cotización formal en PDF.',
    'quote.formal_rejected': (payload, isMe) => 
        isMe ? 'Has rechazado la cotización formal adjunta.' 
             : 'La cotización formal adjunta ha sido rechazada.',
    'quote.accepted': (payload, isMe) => 
        isMe ? 'Has aceptado la cotización. La transacción ha iniciado.' 
             : 'La cotización ha sido aceptada. La transacción ha iniciado.',
    'quote.canceled': (payload, isMe) => 
        isMe ? 'Has cancelado la cotización.' 
             : 'La cotización ha sido cancelada.',
    'quote.expired': () => 'La cotización ha expirado.',

    'transaction.payment_uploaded': (payload, isMe) => 
        isMe ? 'Has subido el comprobante de pago.' 
             : 'Se ha subido el comprobante de pago.',
    'transaction.payment_approved': (payload, isMe) => 
        isMe ? 'Has aprobado el pago. Preparando orden.' 
             : 'El pago ha sido aprobado. Preparando orden.',
    'transaction.payment_rejected': (payload, isMe) => 
        isMe ? 'Has rechazado el pago.' 
             : 'El pago ha sido rechazado.',
    'transaction.order_shipped': (payload, isMe) => 
        isMe ? 'Has marcado la orden como enviada.' 
             : 'La orden ha sido enviada y va en camino.',
    'transaction.completed': (payload, isMe) => 
        isMe ? 'Has confirmado la entrega. Transacción completada.' 
             : 'Se ha confirmado la entrega. Transacción completada.',
    'transaction.canceled': (payload, isMe) => 
        isMe ? 'Has cancelado la transacción.' 
             : 'La transacción ha sido cancelada.',
    'transaction.disputed': (payload, isMe) => 
        isMe ? 'Has iniciado una disputa para esta transacción.' 
             : 'Se ha iniciado una disputa para esta transacción.'
};

export default function SystemMessageBubble({ message, currentCompanyId }) {
    if (!message || message.message_type !== 'system') return null;

    const payload = message.event_payload || {};
    // Determine if the action was performed by the current user's company
    const isMe = payload.actorId === currentCompanyId;
    
    const resolveText = SYSTEM_MESSAGES_DICTIONARY[message.event_key];
    
    // Fallback if the key is not defined in the dictionary yet
    const displayString = resolveText 
        ? resolveText(payload, isMe) 
        : `Evento de sistema: ${message.event_key}`;

    return (
        <div className="flex w-full justify-center items-center my-4 mx-auto px-4">
            <div className="px-4 py-1.5 flex flex-col items-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-medium text-center border border-slate-200 dark:border-slate-700 shadow-sm transition-all max-w-[90%] md:max-w-[70%] leading-relaxed">
                <span>{displayString}</span>
                {(message.file_url || message.event_payload?.fileUrl) && (
                    <a
                        href={message.file_url || message.event_payload?.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs underline"
                    >
                        <FileText className="w-3 h-3" />
                        Ver documento adjunto
                    </a>
                )}
            </div>
        </div>
    );
}
