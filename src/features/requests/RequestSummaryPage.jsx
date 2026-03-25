import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '@/features/requests/services/requestsApi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    ArrowLeft, Package, MapPin, CreditCard, Calendar,
    TrendingDown, TrendingUp, ArrowUpDown, Zap, Flame, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

// Unit labels map
const unitLabels = {
    Units: 'Unidades', Kg: 'Kg', Liters: 'Litros', Meters: 'Metros',
    Boxes: 'Cajas', Pallets: 'Paletas', Tons: 'Toneladas', Gallons: 'Galones',
};

// --- Mock offers data (replace with API call once endpoint is available) ---
// TODO: Replace with useQuery calling quoteResponsesApi.getQuoteResponsesByRequestId(id)
const MOCK_OFFERS = [
    {
        id: '1',
        supplier: { name: 'Capi Rosse', initial: 'C', rating: 4.5, verified: false },
        unit_price: 20,
        total_amount: 4000,
        delivery_time: '3',
        payment_conditions: 'Negociable',
        status: 'Accepted',
        notes: '[Envio: Negociable]',
        is_cheapest: true,
        is_fastest: true,
    },
];

function getStats(offers) {
    if (!offers.length) return null;
    const amounts = offers.map((o) => o.total_amount);
    const deliveries = offers.map((o) => Number(o.delivery_time)).filter(Boolean);
    return {
        min: Math.min(...amounts),
        avg: Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length),
        max: Math.max(...amounts),
        fastest: deliveries.length ? Math.min(...deliveries) : null,
    };
}

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Accepted: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Negotiating: 'bg-blue-100 text-blue-700',
    Expired: 'bg-slate-100 text-slate-500',
};
const statusLabels = {
    Pending: 'Pendiente', Accepted: 'Aceptada', Rejected: 'Rechazada',
    Negotiating: 'Negociando', Expired: 'Expirada',
};

export default function RequestSummaryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: req, isLoading } = useQuery({
        queryKey: ['requestDetail', id],
        queryFn: async () => {
            const res = await requestsApi.getRequestById(id);
            return res.data;
        },
        enabled: !!id,
    });

    // TODO: wire up real mutation to quoteResponsesApi when endpoint is ready
    const updateOfferMutation = useMutation({
        mutationFn: async ({ offerId, status }) => {
            // quoteResponsesApi.updateQuoteResponse(offerId, { status });
            return { offerId, status };
        },
        onSuccess: (_, { status }) => {
            queryClient.invalidateQueries({ queryKey: ['quote-responses', id] });
            toast.success(status === 'Accepted' ? 'Oferta aceptada' : 'Oferta rechazada');
        },
    });

    const offers = MOCK_OFFERS;
    const stats = getStats(offers);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!req) {
        return (
            <div className="text-center py-20 text-slate-500">
                No se encontró la solicitud.
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Resumen de Solicitud</h1>
                    <p className="text-sm text-slate-500">Detalle completo y comparativa de ofertas</p>
                </div>
            </div>

            {/* Request Summary Card */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-5">
                    {/* Title + status */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">{req.product_service}</h2>
                            {req.category && (
                                <Badge variant="secondary" className="mt-1.5 text-xs">{req.category}</Badge>
                            )}
                        </div>
                        <StatusBadge status={req.status} />
                    </div>

                    {/* Key info grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-start gap-2 text-sm">
                            <Package className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-400">Cantidad</p>
                                <p className="font-semibold text-foreground">
                                    {req.quantity} {unitLabels[req.unit_of_measure] || req.unit_of_measure}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-400">Entrega</p>
                                <p className="font-semibold text-foreground">{req.delivery_location || 'Por acordar'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-400">Pago</p>
                                <p className="font-semibold text-foreground">{req.payment_conditions || 'Por acordar'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-400">Fecha Límite</p>
                                <p className="font-semibold text-foreground">
                                    {req.expiration_date
                                        ? format(new Date(req.expiration_date), 'd MMM yyyy', { locale: es })
                                        : 'Sin fecha'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {req.description && (
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Descripción</p>
                            <p className="text-sm text-slate-700 bg-muted/50 rounded-lg p-3">{req.description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stats Row */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-5 flex flex-col items-center gap-2">
                            <TrendingDown className="w-6 h-6 text-emerald-500" />
                            <p className="text-xs text-slate-500">Precio más bajo</p>
                            <p className="text-xl font-bold text-emerald-600">${stats.min.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-5 flex flex-col items-center gap-2">
                            <ArrowUpDown className="w-6 h-6 text-blue-500" />
                            <p className="text-xs text-slate-500">Precio promedio</p>
                            <p className="text-xl font-bold text-blue-600">${stats.avg.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-5 flex flex-col items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-red-500" />
                            <p className="text-xs text-slate-500">Precio más alto</p>
                            <p className="text-xl font-bold text-red-600">${stats.max.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-5 flex flex-col items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-500" />
                            <p className="text-xs text-slate-500">Entrega más rápida</p>
                            <p className="text-xl font-bold text-yellow-600">
                                {stats.fastest != null ? `${stats.fastest} días` : '—'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* All Offers Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-3">
                    <h3 className="font-semibold text-foreground">
                        Todas las Ofertas ({offers.length})
                    </h3>
                </div>
                {offers.length === 0 ? (
                    <CardContent className="pb-8 text-center text-sm text-slate-400">
                        <Flame className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                        Aún no hay ofertas para esta solicitud
                    </CardContent>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/50 border-y border-border">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">Proveedor</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Precio Unit.</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Total</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Entrega</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Pago</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Estado</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Notas</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {offers.map((offer) => (
                                    <tr key={offer.id} className="hover:bg-muted/50/50 transition-colors">
                                        {/* Supplier */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                                                    {offer.supplier.initial}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{offer.supplier.name}</p>
                                                    <div className="flex gap-1 mt-0.5">
                                                        {offer.is_cheapest && (
                                                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                                                <Flame className="w-2.5 h-2.5" /> Más barato
                                                            </span>
                                                        )}
                                                        {offer.is_fastest && (
                                                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                                                                <Zap className="w-2.5 h-2.5" /> Más rápido
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Unit price */}
                                        <td className="px-4 py-4 text-right font-medium text-slate-700">${offer.unit_price}</td>
                                        {/* Total */}
                                        <td className="px-4 py-4 text-right font-bold text-emerald-600">
                                            ${offer.total_amount.toLocaleString()}
                                        </td>
                                        {/* Delivery */}
                                        <td className="px-4 py-4 text-center text-slate-600">{offer.delivery_time}</td>
                                        {/* Payment */}
                                        <td className="px-4 py-4 text-slate-600">{offer.payment_conditions || '—'}</td>
                                        {/* Status */}
                                        <td className="px-4 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[offer.status] || 'bg-slate-100 text-slate-500'}`}>
                                                • {statusLabels[offer.status] || offer.status}
                                            </span>
                                        </td>
                                        {/* Notes */}
                                        <td className="px-4 py-4 text-slate-500 text-xs max-w-[140px] truncate">
                                            {offer.notes || '—'}
                                        </td>
                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 px-3 text-xs"
                                                    disabled={offer.status !== 'Pending'}
                                                    onClick={() => updateOfferMutation.mutate({ offerId: offer.id, status: 'Negotiating' })}
                                                >
                                                    Negociar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="h-7 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                                                    disabled={offer.status !== 'Pending'}
                                                    onClick={() => updateOfferMutation.mutate({ offerId: offer.id, status: 'Accepted' })}
                                                >
                                                    Aceptar
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                                                    disabled={offer.status !== 'Pending'}
                                                    onClick={() => updateOfferMutation.mutate({ offerId: offer.id, status: 'Rejected' })}
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
