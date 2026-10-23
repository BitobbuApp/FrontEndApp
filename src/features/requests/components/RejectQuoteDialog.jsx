import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { quoteResponsesApi } from '../services/quoteResponsesApi';

/** Quote statuses after which the buyer can no longer reject. */
export const FINAL_QUOTE_STATUSES = ['accepted', 'rejected', 'expired'];

const MAX_REASON_LENGTH = 500;

// 'reject': the buyer rejects the supplier's quote. 'withdraw': the supplier withdraws its own quote.
const MODES = {
    reject: {
        action: 'rejected',
        title: (name) => `¿Rechazar la oferta${name ? ` de ${name}` : ''}?`,
        description: 'Esta acción es definitiva. El proveedor será notificado y, si había una negociación abierta, el chat quedará solo como historial.',
        placeholder: 'Ej: El precio está fuera de nuestro presupuesto',
        confirmLabel: 'Rechazar oferta',
        successMessage: 'Oferta rechazada',
        errorMessage: 'Error al rechazar la oferta',
    },
    withdraw: {
        action: 'canceled',
        title: () => '¿Retirar tu oferta?',
        description: 'Esta acción es definitiva. El comprador será notificado y la negociación se cerrará: el chat quedará solo como historial.',
        placeholder: 'Ej: Ya no tenemos stock disponible',
        confirmLabel: 'Retirar oferta',
        successMessage: 'Oferta retirada',
        errorMessage: 'Error al retirar la oferta',
    },
};

/**
 * Definitively closes a quote with an optional reason shown to the counterparty:
 * the buyer rejects it (mode="reject") or the supplier withdraws it (mode="withdraw").
 * If the quote already had a chat, the backend closes it (read-only history).
 */
export default function RejectQuoteDialog({ open, onOpenChange, quoteId, supplierName, onRejected, mode = 'reject' }) {
    const queryClient = useQueryClient();
    const [reason, setReason] = useState('');
    const copy = MODES[mode] || MODES.reject;

    const rejectMutation = useMutation({
        mutationFn: async () => {
            const res = await quoteResponsesApi.performAction(quoteId, {
                action: copy.action,
                payload: reason.trim() ? { reason: reason.trim() } : {},
            });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['quote-responses'] });
            queryClient.invalidateQueries({ queryKey: ['quote-response-detail'] });
            queryClient.invalidateQueries({ queryKey: ['requestDetail'] });
            queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
            toast.success(copy.successMessage);
            setReason('');
            onOpenChange(false);
            onRejected?.(data);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || copy.errorMessage);
        },
    });

    const handleOpenChange = (next) => {
        if (!next) setReason('');
        onOpenChange(next);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{copy.title(supplierName)}</DialogTitle>
                    <DialogDescription>{copy.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <Label htmlFor="reject-reason">Motivo (opcional)</Label>
                    <Textarea
                        id="reject-reason"
                        placeholder={copy.placeholder}
                        value={reason}
                        onChange={(e) => setReason(e.target.value.slice(0, MAX_REASON_LENGTH))}
                        className="min-h-[90px] resize-none"
                        disabled={rejectMutation.isPending}
                    />
                    <p className="text-xs text-slate-400 text-right">{reason.length}/{MAX_REASON_LENGTH}</p>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={rejectMutation.isPending}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => rejectMutation.mutate()}
                        disabled={rejectMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {rejectMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {copy.confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
