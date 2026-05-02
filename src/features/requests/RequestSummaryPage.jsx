import React, { useState } from 'react';
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
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';
import { quoteResponsesApi } from '@/features/requests/services/quoteResponsesApi';
import RequestOffersTable from './components/RequestOffersTable';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import tooltips from '@/constants/tooltips.json';

// Unit labels map
const unitLabels = {
    Units: 'Unidades', Kg: 'Kg', Liters: 'Litros', Meters: 'Metros',
    Boxes: 'Cajas', Pallets: 'Paletas', Tons: 'Toneladas', Gallons: 'Galones',
};



function getStats(offers) {
    if (!offers || !offers.length) return null;
    const amounts = offers.filter(o => o.status !== 'Rejected').map((o) => Number(o.total_amount_usd));
    const deliveries = offers
        .filter(o => o.status !== 'Rejected' && o.estimated_delivery_hours != null)
        .map((o) => Number(o.estimated_delivery_hours));
    
    if (!amounts.length) return null;
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
    const [page, setPage] = useState(1);
    const { paymentConditionOptions, resolveLocation } = useAppMetadata();

    const { data: req, isLoading } = useQuery({
        queryKey: ['requestDetail', id],
        queryFn: async () => {
            const res = await requestsApi.getRequestById(id);
            return res.data;
        },
        enabled: !!id,
    });

    const { data: offersResponse, isLoading: isLoadingOffers } = useQuery({
        queryKey: ['quote-responses', id, page],
        queryFn: () => quoteResponsesApi.getQuoteResponsesByRequestId(id, { page, limit: 10 }),
        enabled: !!id,
    });

    const offers = offersResponse?.data?.items || offersResponse?.data || [];
    const pagination = offersResponse?.data?.pagination || {
        totalItems: offersResponse?.data?.total || 0,
        totalPages: offersResponse?.data?.totalPages || 1,
    };
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
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 flex items-center">
                                   CANTIDAD
                                   <InfoTooltip content={tooltips.summary.quantity} />
                                </p>
                                <p className="font-semibold text-foreground">
                                    {req.quantity} {unitLabels[req.unit_of_measure] || req.unit_of_measure}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-400">Entrega</p>
                                <p className="font-semibold text-foreground">{resolveLocation(req.country_id, req.state_id)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-400">Pago</p>
                                <p className="font-semibold text-foreground">{paymentConditionOptions.find(opt => opt.id === req.payment_condition_id )?.label || 'Por acordar'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 flex items-center">
                                   CIERRE
                                   <InfoTooltip content={tooltips.summary.deadline} />
                                </p>
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
                    {/* Description */}
                    {req.reach_service && req.type === 'service' && (
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Alcance del Servicio</p>
                            <p className="text-sm text-slate-700 bg-muted/50 rounded-lg p-3">{req.reach_service}</p>
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
                                {stats.fastest != null 
                                    ? stats.fastest >= 24 
                                        ? `${Math.round(stats.fastest / 24)} días` 
                                        : `${stats.fastest} horas`
                                    : '—'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* All Offers Table */}
            {isLoadingOffers ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                </div>
            ) : (
                <RequestOffersTable 
                    offers={offers} 
                    requestId={id} 
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}
