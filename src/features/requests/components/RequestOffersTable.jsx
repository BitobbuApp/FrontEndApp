import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RotateCcw, MoreHorizontal, MessageSquare, Flame, Zap, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { quoteResponsesApi } from '../services/quoteResponsesApi';
import Pagination from '@/components/atoms/Pagination';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    negotiating: 'bg-blue-100 text-blue-700',
    expired: 'bg-slate-100 text-slate-500',
};

const statusLabels = {
    pending: 'Pendiente',
    accepted: 'Aceptada',
    rejected: 'Rechazada',
    negotiating: 'Negociando',
    expired: 'Expirada',
};

export default function RequestOffersTable({ 
    offers = [], 
    requestId,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    onPageChange
}) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { paymentConditionOptions } = useAppMetadata();

    const updateOfferMutation = useMutation({
        mutationFn: async ({ offerId, status }) => {
            const response = await quoteResponsesApi.updateQuoteResponse(offerId, { status });
            return response.data;
        },
        onSuccess: (_, { status }) => {
            queryClient.invalidateQueries({ queryKey: ['quote-responses', requestId] });
            queryClient.invalidateQueries({ queryKey: ['requestDetail', requestId] });
            toast.success(`Oferta ${status === 'accepted' ? 'aceptada' : status === 'negotiating' ? 'en negociación' : 'rechazada'} exitosamente`);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error al actualizar la oferta');
        },
    });

    const startNegotiationMutation = useMutation({
        mutationFn: async (offerId) => {
            const res = await quoteResponsesApi.performAction(offerId, { action: 'negotiation_started' });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['quote-responses', requestId] });
            toast.success('Negociación iniciada con éxito');
            const conversationId = data.conversation?.id || data.conversation_id;
            if (conversationId) {
                navigate(`/Chat/${conversationId}`);
            } else {
                navigate(`/Chat`);
            }
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error al iniciar negociación');
        }
    });

    if (!offers.length) {
        return (
            <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="py-12 text-center text-sm text-slate-400">
                    <RotateCcw className="w-8 h-8 mx-auto mb-3 text-slate-200 animate-pulse" />
                    Aún no hay ofertas para esta solicitud
                </CardContent>
            </Card>
        );
    }

    // Calculate cheapest & fastest
    const minPrice = Math.min(...offers.map(o => o.total_amount_usd));
    const minDelivery = Math.min(...offers.map(o => Number(o.delivery_time)).filter(Boolean));

    return (
        <Card className="border-0 shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-3 bg-white border-b border-slate-50">
                <h3 className="font-semibold text-foreground text-base">
                    Todas las Ofertas ({offers.length})
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proveedor</th>
                            <th className="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio Unit.</th>
                            <th className="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                            <th className="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Entrega</th>
                            <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pago</th>
                            <th className="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                            <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Notas</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {offers.map((offer) => {
                            const isCheapest = offer.total_amount_usd === minPrice;
                            const isFastest = Number(offer.delivery_time) === minDelivery;

                            return (
                                <tr key={offer.id} className="hover:bg-slate-50/30 transition-all duration-200 group">
                                    {/* Supplier */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0 shadow-sm">
                                                {offer.supplier?.trade_name?.charAt(0) || 'S'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{offer.supplier?.trade_name || 'Proveedor'}</p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    <span className="text-[10px] font-bold text-slate-600">
                                                        {Number(offer.supplier?.average_rating || 0).toFixed(1)}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1.5 mt-1">
                                                    {isCheapest && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-md border border-green-100 transition-transform hover:scale-105">
                                                            <Flame className="w-2.5 h-2.5" /> AHORRO
                                                        </span>
                                                    )}
                                                    {isFastest && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md border border-amber-100 transition-transform hover:scale-105">
                                                            <Zap className="w-2.5 h-2.5" /> RÁPIDO
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Unit price */}
                                    <td className="px-4 py-5 text-right font-medium text-slate-600">
                                        ${Number(offer.unit_price_usd).toLocaleString()}
                                    </td>
                                    {/* Total */}
                                    <td className="px-4 py-5 text-right">
                                        <span className="font-bold text-slate-900 text-base">
                                            ${Number(offer.total_amount_usd).toLocaleString()}
                                        </span>
                                    </td>
                                    {/* Delivery */}
                                    <td className="px-4 py-5 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">
                                            {offer.delivery_time}
                                        </div>
                                    </td>
                                    {/* Payment */}
                                    <td className="px-4 py-5 text-slate-600 max-w-[120px] truncate italic">
                                        {paymentConditionOptions.find(opt => opt.value === String(offer.payment_condition_id))?.label || '—'}
                                    </td>
                                    {/* Status */}
                                    <td className="px-4 py-5 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColors[offer.status] || 'bg-slate-100 text-slate-500'}`}>
                                            {statusLabels[offer.status] || offer.status}
                                        </span>
                                    </td>
                                    {/* Notes */}
                                    <td className="px-4 py-5 text-slate-500 text-xs max-w-[160px] leading-relaxed italic">
                                        {offer.notes ? (
                                            <>
                                                {offer.notes.substring(0, 50)}
                                                {offer.notes.length > 50 ? '...' : ''}
                                            </>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                    {/* Actions */}
                                    <td className="px-6 py-5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-8 w-8 p-0 hover:bg-slate-100"
                                                    disabled={updateOfferMutation.isPending}
                                                >
                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 p-1 shadow-xl border-slate-200">
                                                <DropdownMenuItem 
                                                    className="flex items-center gap-2 py-2 cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50 font-medium"
                                                    onClick={() => navigate(`/Quotes/${offer.id}`)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Ver Detalle
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="flex items-center gap-2 py-2 cursor-pointer text-slate-600 focus:text-slate-700 focus:bg-slate-50 font-medium"
                                                    disabled={startNegotiationMutation.isPending}
                                                    onClick={() => startNegotiationMutation.mutate(offer.id)}
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                    Negociar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {offers.length > 0 && onPageChange && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={onPageChange}
                    itemsLabel="oferta"
                    itemsLabelPlural="ofertas"
                />
            )}
        </Card>
    );
}
