import { toast } from 'sonner';

/**
 * Evaluates whether a toast should be shown for a global state event.
 */
export const showToastForEvent = (payload, myCompanyId) => {
    // To avoid annoying the user, do not show pop-up toasts for actions they just performed themselves
    if (payload?.actor_company_id === myCompanyId) {
        return;
    }

    const { action } = payload;

    // High-priority global toasts for the recipient when a negotiation or order starts
    if (action === 'negotiation_started') {
        toast.info(`🛒 ¡Un cliente inició una negociación!`, {
            description: `Revisa la bandeja de entrada para responder.`,
            duration: 6000,
        });
    } else if (action === 'accepted') {
        toast.success(`🎉 ¡Cotización Aceptada!`, {
            description: `El cliente ha cerrado la negociación. Revisa la de logística.`,
            duration: 6000,
        });
    } else if (action === 'payment_uploaded') {
        toast.info(`💳 Comprobante de pago subido`, {
            description: `El cliente actualizó la logística. Por favor revísalo.`,
            duration: 6000,
        });
    } else if (action === 'delivery_confirmed') {
        toast.success(`✅ Entrega Confirmada`, {
            description: `El cliente recibió los bienes y el trato se cerró.`,
            duration: 6000,
        });
    }
};
