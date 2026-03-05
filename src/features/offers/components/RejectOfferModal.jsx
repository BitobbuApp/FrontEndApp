import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

export default function RejectOfferModal({
    open,
    onOpenChange,
    rejectReason,
    onRejectReasonChange,
    onConfirm,
    isPending,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rechazar Oferta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-slate-600">
                        ¿Por qué rechazas esta oferta? (opcional)
                    </p>
                    <Textarea
                        placeholder="Escribe el motivo del rechazo..."
                        value={rejectReason}
                        onChange={(e) => onRejectReasonChange(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        Confirmar Rechazo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
