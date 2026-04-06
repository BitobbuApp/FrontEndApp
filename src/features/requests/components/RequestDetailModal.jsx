import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { requestsApi } from '@/features/requests/services/requestsApi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/ui/StatusBadge';
import { FileText, Calendar, Package, Layers, Tag, Loader2, CreditCard, MapPin } from 'lucide-react';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';

const unitLabels = {
    Units: 'Unidades',
    Kg: 'Kg',
    Liters: 'Litros',
    Meters: 'Metros',
    Boxes: 'Cajas',
    Pallets: 'Paletas',
    Tons: 'Toneladas',
    Gallons: 'Galones',
};

export default function RequestDetailModal({ open, onOpenChange, requestId }) {
    const { data: requestData, isLoading } = useQuery({
        queryKey: ['requestDetail', requestId],
        queryFn: async () => {
            const response = await requestsApi.getRequestById(requestId);
            return response.data;
        },
        enabled: !!requestId && open,
    });

    const { paymentConditionOptions, resolveLocation } = useAppMetadata();

    const resolvePaymentCondition = (id) => {
        if (!id) return 'Por acordar';
        return paymentConditionOptions.find((o) => Number(o.id) === Number(id) || o.value === id)?.label || 'Por acordar';
    };

    const req = requestData;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh] p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
                    <DialogTitle className="text-xl font-bold text-foreground">
                        Detalle de Solicitud
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-5">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        </div>
                    ) : req ? (
                        <div className="space-y-5">
                            {/* Product & Status */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {req.product_service}
                                    </h3>
                                    {req.category && (
                                        <Badge variant="secondary" className="text-xs mt-1">
                                            {req.category}
                                        </Badge>
                                    )}
                                </div>
                                <StatusBadge status={req.status} />
                            </div>

                            {/* Key Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                        <Package className="w-4 h-4" />
                                        Cantidad
                                    </div>
                                    <p className="font-semibold text-foreground">
                                        {req.quantity} {unitLabels[req.unit_of_measure] || req.unit_of_measure}
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                        <Layers className="w-4 h-4" />
                                        Ofertas recibidas
                                    </div>
                                    <p className="font-semibold text-foreground">
                                        {req.response_count || 0}
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Fecha de creación
                                    </div>
                                    <p className="font-semibold text-foreground text-sm">
                                        {format(new Date(req.created_at), "d 'de' MMMM yyyy", { locale: es })}
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Fecha límite
                                    </div>
                                    <p className="font-semibold text-foreground text-sm">
                                        {req.expiration_date
                                            ? format(new Date(req.expiration_date), "d 'de' MMMM yyyy", { locale: es })
                                            : 'Sin fecha límite'}
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-xl p-4 col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                            <MapPin className="w-4 h-4" />
                                            Entrega
                                        </div>
                                        <p className="font-semibold text-foreground text-sm">
                                            {resolveLocation(req.country_id, req.state_id)}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                            <CreditCard className="w-4 h-4" />
                                            Pago
                                        </div>
                                        <p className="font-semibold text-foreground text-sm">
                                            {resolvePaymentCondition(req.payment_condition_id)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {req.description && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 mb-2 flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        Descripción
                                    </h4>
                                    <p className="text-slate-700 text-sm bg-muted/50 rounded-xl p-4 leading-relaxed">
                                        {req.description}
                                    </p>
                                </div>
                            )}

                            {/* Files */}
                            {req.files && req.files.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Archivos adjuntos ({req.files.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {req.files.map((file) => (
                                            <a
                                                key={file.id}
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 bg-muted/50 hover:bg-blue-50 rounded-xl px-4 py-3 border border-border text-sm text-blue-600 transition-colors"
                                            >
                                                <FileText className="w-5 h-5 flex-shrink-0" />
                                                <span className="truncate">{file.file_name}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="text-xs text-slate-400 pt-2 border-t border-border">
                                ID: {req.id}
                                <br />
                                Última actualización: {format(new Date(req.updated_at), "d MMM yyyy, HH:mm", { locale: es })}
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-12">No se encontró la solicitud</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
