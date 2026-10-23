import { Flame, Zap, Check, MessageSquare, Star, ExternalLink, ShieldCheck, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { quoteResponsesApi } from '../services/quoteResponsesApi';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';

// Derive stats from responses
function getOfferHighlights(responses) {
    if (!responses.length) return { bestPrice: null, fastestDelivery: null };
    
    const bestPrice = responses.reduce((prev, curr) => (curr.total_amount_usd < prev.total_amount_usd ? curr : prev));
    
    // Attempt to extract numeric delivery days for comparison
    const getDays = (str) => {
        const match = String(str).match(/\d+/);
        return match ? parseInt(match[0], 10) : 999;
    };
    
    const fastestDelivery = responses.reduce((prev, curr) =>
        getDays(curr.delivery_time) < getDays(prev.delivery_time) ? curr : prev
    );
    
    return { bestPrice, fastestDelivery };
}

export default function RequestRowExpanded({ request }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { paymentConditionOptions } = useAppMetadata();

    // Status changes go through the state machine: open the negotiation and continue in the chat
    const startNegotiationMutation = useMutation({
        mutationFn: async (resp) => {
            const res = await quoteResponsesApi.performAction(resp.id, { action: 'negotiation_started' });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['quote-responses', request.id] });
            queryClient.invalidateQueries({ queryKey: ['requestDetail', request.id] });
            queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
            toast.success('Negociación iniciada con éxito');
            navigate(data?.conversation_id ? `/Chat/${data.conversation_id}` : '/Chat');
        },
        onError: (err) => toast.error(err?.response?.data?.message || err.message || 'Error al iniciar negociación')
    });

    // Fetch actual data from backend - LIMIT 2 as requested
    const { data: responseData, isLoading } = useQuery({
         queryKey: ['quote-responses', 'highlights', request.id],
         queryFn: () => quoteResponsesApi.getQuoteResponsesByRequestId(request.id, { limit: 2 }),
         enabled: !!request.id,
         staleTime: 1000 * 60 * 5, // 5 min cache
    });
    
    const responses = responseData?.data?.items || [];
    const { bestPrice, fastestDelivery } = getOfferHighlights(responses);
    const showFastest = fastestDelivery && fastestDelivery.id !== bestPrice?.id;

    if (isLoading) {
        return (
            <div className="bg-slate-50 p-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D2FC31]"></div>
            </div>
        );
    }

    if (responses.length === 0) return null;

    return (
        <div className="bg-slate-50 border-y border-slate-100 p-8 space-y-8 animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-lg">
                    Mejores Ofertas <span className="text-slate-400 font-normal text-sm ml-2">({request.response_count} recibidas)</span>
                </h4>
            </div>

            <div className={`grid grid-cols-1 ${showFastest ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'} gap-6`}>
                {/* ── Best Price Card ── */}
                {bestPrice && (
                    <OfferPreviewCard 
                        offer={bestPrice} 
                        type={showFastest ? "price" : "both"} 
                        onNegotiate={() => startNegotiationMutation.mutate(bestPrice)}
                        isNegotiating={startNegotiationMutation.isPending}
                        paymentConditionOptions={paymentConditionOptions}
                    />
                )}

                {/* ── Fastest Delivery Card ── */}
                {showFastest && (
                    <OfferPreviewCard 
                        offer={fastestDelivery} 
                        type="delivery" 
                        onNegotiate={() => startNegotiationMutation.mutate(fastestDelivery)}
                        isNegotiating={startNegotiationMutation.isPending}
                        paymentConditionOptions={paymentConditionOptions}
                    />
                )}
            </div>

            <div className="flex justify-center pt-2">
                <Button 
                    variant="outline" 
                    onClick={() => navigate(`/Requests/${request.id}/summary`)}
                    className="group border-slate-200 hover:border-[#D2FC31] hover:bg-slate-50 text-slate-600 hover:text-slate-900 px-8 h-12 transition-all rounded-xl"
                >
                    Ver todas las ofertas 
                    <ExternalLink className="w-4 h-4 ml-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                </Button>
            </div>
        </div>
    );
}

function OfferPreviewCard({ offer, type, onNegotiate, isNegotiating, paymentConditionOptions }) {
    const isPrice = type === 'price';
    const isBoth = type === 'both';
    const paymentLabel = paymentConditionOptions.find(opt => opt.value === String(offer.payment_condition_id))?.label || '—';

    return (
        <div className={`relative bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-md ${isPrice || isBoth ? 'border-[#D2FC31]/40' : 'border-blue-100'}`}>
            {/* Badge */}
            <div className="absolute -top-3 left-6">
                {isBoth ? (
                    <div className="bg-[#D2FC31] text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                        <Flame className="w-3.5 h-3.5" /> Mejor Opción Global
                    </div>
                ) : isPrice ? (
                    <div className="bg-[#D2FC31] text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                        <Flame className="w-3.5 h-3.5" /> Mejor Precio
                    </div>
                ) : (
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                        <Zap className="w-3.5 h-3.5" /> Entrega más Rápida
                    </div>
                )}
            </div>

            <div className="flex items-start justify-between gap-4 mt-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-lg border border-slate-200 shadow-sm">
                        {offer.supplier?.trade_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-900 text-base leading-tight">
                            {offer.supplier?.trade_name || 'Proveedor'}
                        </h5>
                        <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                    key={s} 
                                    className={`w-3 h-3 ${s <= Math.round(offer.supplier?.average_rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} 
                                />
                            ))}
                            <span className="text-[11px] font-bold text-slate-400 ml-1">
                                {offer.supplier?.average_rating?.toFixed(1) || '0.0'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-1">
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">${Number(offer.unit_price_usd).toLocaleString()}</span>
                    <span className="text-slate-400 text-xs font-medium">/unidad</span>
                </div>
                <p className="text-xs text-slate-500">Total: <span className="font-semibold">${Number(offer.total_amount_usd).toLocaleString()}</span></p>
            </div>

            <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isPrice ? 'bg-amber-400' : 'bg-blue-400'}`} />
                    {offer.delivery_time}
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <div className="capitalize">{paymentLabel}</div>
            </div>

            <div className="mt-6 w-full">
                <Button
                    variant="outline"
                    onClick={onNegotiate}
                    disabled={isNegotiating}
                    className="w-full h-10 rounded-xl text-xs font-bold border-slate-100 hover:bg-slate-50 gap-2"
                >
                    <MessageSquare className="w-3.5 h-3.5" /> Negociar
                </Button>
            </div>
        </div>
    );
}
