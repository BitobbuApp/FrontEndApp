import { useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { socket } from '@/api/socketClient';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function GlobalSocketManager() {
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isAuthenticated || !user || !socket) return;

        const myCompanyId = user.companyId || user.company_id || user.id;
        
        // This relies on the backend broadcasting `emit` to `company_${myCompanyId}`
        // specifically for cross-session/cross-view notifications!

        const handleGlobalStateUpdate = (payload) => {
            // Re-fetch conversation lists globally (updates badges, red dots, chat lists)
            queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
            
            // Re-fetch specific items if payload knows what changed
            if (payload?.quote_response_id) {
                queryClient.invalidateQueries({ queryKey: ['quote-responses'] });
                queryClient.invalidateQueries({ queryKey: ['quote-response-detail', payload.quote_response_id] });
            }
            if (payload?.transaction_id) {
                queryClient.invalidateQueries({ queryKey: ['transaction-detail', payload.transaction_id] });
            }

            // To avoid annoying the user, do not show pop-up toasts for actions they just performed themselves
            if (payload?.actor_company_id === myCompanyId) {
                return;
            }

            // High-priority global toasts for the recipient when a negotiation or order starts
            if (payload?.action === 'negotiation_started') {
                toast.info(`🛒 ¡Un cliente inició una negociación!`, {
                    description: `Revisa la bandeja de entrada para responder.`,
                    duration: 6000,
                });
            } else if (payload?.action === 'accepted') {
                toast.success(`🎉 ¡Cotización Aceptada!`, {
                    description: `El cliente ha cerrado la negociación. Revisa la de logística.`,
                    duration: 6000,
                });
            } else if (payload?.action === 'payment_uploaded') {
                toast.info(`💳 Comprobante de pago subido`, {
                    description: `El cliente actualizó la logística. Por favor revísalo.`,
                    duration: 6000,
                });
            } else if (payload?.action === 'delivery_confirmed') {
                toast.success(`✅ Entrega Confirmada`, {
                    description: `El cliente recibió los bienes y el trato se cerró.`,
                    duration: 6000,
                });
            }
        };

        const stateEvents = [
            'quote:negotiation_started', 'quote:updated', 'quote:formal_requested',
            'quote:formal_attached', 'quote:formal_rejected', 'quote:accepted',
            'quote:canceled', 'quote:expired',
            'transaction:payment_uploaded', 'transaction:payment_approved',
            'transaction:payment_rejected', 'transaction:order_shipped',
            'transaction:delivery_confirmed', 'transaction:canceled', 'transaction:dispute_raised',
            'review:submitted'
        ];

        // Attach global listeners
        stateEvents.forEach(evt => socket.on(evt, handleGlobalStateUpdate));

        return () => {
            stateEvents.forEach(evt => socket.off(evt, handleGlobalStateUpdate));
        };
    }, [isAuthenticated, user, queryClient]);

    return null; // This is a headless component, purely for logic!
}
