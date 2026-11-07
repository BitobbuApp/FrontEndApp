import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const DEAL_STEPS = ['Contacto', 'Negociación', 'Confirmar trato', 'Preparando', 'En ruta', 'Entregado'];

/** Colors come from the app palette (StatusBadge families + brand navy / lime). */
export const STAGE_TONES = {
    pending: { pill: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
    negotiating: { pill: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    formal_requested: { pill: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    confirming_terms: { pill: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    awaiting_payment: { pill: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    preparing: { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    in_transit: { pill: 'bg-[#0B2046] text-white border-[#0B2046]', dot: 'bg-[#D2FC31]' },
    completed: { pill: 'bg-[#D2FC31] text-slate-900 border-[#D2FC31]', dot: 'bg-[#0B2046]' },
    dispute: { pill: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
    closed: { pill: 'bg-slate-100 text-slate-700 border-border', dot: 'bg-slate-400' },
};

const QUOTE_STAGES = {
    pending: { step: 0, key: 'pending', label: 'Pendiente de confirmación' },
    negotiating: { step: 1, key: 'negotiating', label: 'En negociación' },
    formal_request_pending: { step: 2, key: 'formal_requested', label: 'Cotización formal solicitada' },
    formal_approval_pending: { step: 2, key: 'confirming_terms', label: 'Confirmando términos' },
    accepted: { step: 2, key: 'confirming_terms', label: 'Confirmando términos' },
};

const TRANSACTION_STAGES = {
    awaiting_payment: { step: 2, key: 'awaiting_payment', label: 'Esperando pago' },
    payment_review: { step: 2, key: 'awaiting_payment', label: 'Pago en revisión' },
    preparing_order: { step: 3, key: 'preparing', label: 'Preparando pedido' },
    in_transit: { step: 4, key: 'in_transit', label: 'En ruta' },
    completed: { step: 5, key: 'completed', label: 'Completada' },
    in_dispute: { step: 3, key: 'dispute', label: 'En disputa' },
};

const formatUsd = (value) =>
    `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function resolveDelivery(transaction, quote) {
    if (transaction?.estimated_delivery_date) {
        return format(new Date(transaction.estimated_delivery_date), "EEE d/M", { locale: es });
    }
    return transaction?.delivery_time || quote?.delivery_time || 'Por acordar';
}

function resolveHint(key, isSupplier, conversation) {
    const mine = (supplierText, buyerText) => (isSupplier ? supplierText : buyerText);
    switch (key) {
        case 'pending':
            return mine('Te toca: confirma la disponibilidad', 'Esperando que el proveedor confirme');
        case 'negotiating':
            return 'Chat abierto: conversen con libertad';
        case 'formal_requested':
            return mine('Te toca: envía la cotización formal en PDF', 'Esperando la cotización formal del proveedor');
        case 'confirming_terms':
            return mine('Esperando que el comprador confirme', 'Te toca: revisa la cotización formal');
        case 'awaiting_payment':
            return mine('Esperando el comprobante de pago', 'Te toca: sube el comprobante de pago');
        case 'preparing':
            return mine('Te toca: marca el pedido en ruta', 'El proveedor está preparando tu pedido');
        case 'in_transit':
            return mine('Esperando que el comprador confirme', 'Te toca: confirma la recepción');
        case 'completed':
            return conversation?.status === 'pending_review' ? 'Falta calificar para cerrar la negociación' : 'Negociación completada';
        case 'dispute':
            return 'Hay una disputa abierta en este trato';
        case 'closed':
            return 'Negociación cerrada';
        default:
            return null;
    }
}

/**
 * Derives the deal stage shown in the chat (status pill, stepper, banner, hint and terms card)
 * from the conversation + quote response + transaction already used by the action panel.
 * Returns null when there is nothing to describe (e.g. general chat without a quote).
 */
export function getDealStage({ conversation, quote, transaction, myId }) {
    if (!conversation) return null;
    if (!quote && !transaction && conversation.status !== 'cancelled') return null;

    const isSupplier = transaction ? transaction.supplier_id === myId : quote?.supplier_id === myId;

    const isClosed =
        conversation.status === 'cancelled' ||
        transaction?.status === 'canceled' ||
        (['rejected', 'expired'].includes(quote?.status) && !transaction);

    let base;
    if (isClosed) {
        base = { step: null, key: 'closed', label: 'Cerrada' };
    } else if (transaction) {
        base = ['pending_review', 'completed'].includes(conversation.status)
            ? TRANSACTION_STAGES.completed
            : TRANSACTION_STAGES[transaction.status];
    } else {
        base = QUOTE_STAGES[quote?.status];
    }
    if (!base) return null;

    const quantity = transaction?.quantity ?? quote?.quantity ?? conversation.request?.quantity;
    const unit = conversation.request?.unit || '';
    const total = transaction?.total_amount_usd ?? quote?.total_amount_usd;

    return {
        ...base,
        tone: STAGE_TONES[base.key],
        isSupplier,
        isClosed,
        hint: resolveHint(base.key, isSupplier, conversation),
        locked: !!transaction && transaction.status !== 'canceled' && !isClosed,
        showTerms: !isClosed && base.step >= 2,
        terms: {
            product: transaction?.product_description || conversation.request?.product_service || '',
            quantityLabel: quantity != null ? `${Number(quantity).toLocaleString('en-US')}${unit ? ` ${unit}` : ''}` : '—',
            totalLabel: total != null ? formatUsd(total) : '—',
            deliveryLabel: resolveDelivery(transaction, quote),
        },
        // Real meaning in the current flow: supplier = sent the formal quote, buyer = accepted it
        approvals: {
            supplier: !!transaction || ['formal_approval_pending', 'accepted'].includes(quote?.status),
            buyer: !!transaction || quote?.status === 'accepted',
        },
    };
}
