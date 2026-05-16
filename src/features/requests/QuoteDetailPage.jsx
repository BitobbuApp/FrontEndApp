import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ShieldCheck, MapPin, 
    Briefcase, MessageSquare, X, 
    ImageIcon, FileText, CheckCircle2, Clock, 
    CreditCard, Truck, Shield, AlertCircle, Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Shared Components
import DetailLayout from '@/components/layout/DetailLayout';
import DetailMetric from '@/components/shared/DetailMetric';
import CompanyProfileCard from '@/components/shared/CompanyProfileCard';

// Feature specific
import ReviewModal from '@/features/suppliers/components/ReviewModal';
import { quoteResponsesApi } from './services/quoteResponsesApi';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';

export default function QuoteDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const { 
        paymentConditionOptions, 
        deliveryMethodOptions, 
        categoryOptions,
        resolveLocation 
    } = useAppMetadata();

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['quote-response-detail', id],
        queryFn: () => quoteResponsesApi.getQuoteResponseWithSupplier(id),
        enabled: !!id
    });

    const startNegotiationMutation = useMutation({
        mutationFn: async () => {
            const res = await quoteResponsesApi.performAction(id, { action: 'negotiation_started' });
            return res.data;
        },
        onSuccess: (data) => {
            toast.success('Bandeja de negociación creada con éxito');
            // 'data' returning from performAction normally returns the updated quote with its conversation
            const conversationId = data.conversation?.id || data.conversation_id;
            if (conversationId) {
                navigate(`/Chat/${conversationId}`);
            } else {
                // Flashback: if we just get success but no payload, fallback to generic /Chat route or refresh
                navigate(`/Chat`);
            }
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error al iniciar negociación');
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm font-medium text-slate-500">Cargando detalles de la oferta...</p>
            </div>
        );
    }

    if (isError || !response?.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 px-4 text-center">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Error al cargar la oferta</h3>
                    <p className="text-sm text-slate-500 mt-1">No pudimos encontrar la información solicitada. Por favor, intenta de nuevo.</p>
                </div>
                <Button onClick={() => navigate(-1)} variant="outline">Volver</Button>
            </div>
        );
    }

    const data = response.data;
    const supplier = data.supplier || {};
    const mainHeadquarters = supplier.locations?.find(loc => loc.is_main_headquarters) || supplier.locations?.[0];

    const quote = {
        id: data.id,
        supplierId: data.supplier_id,
        relatedRequest: data.request?.product_service || "Solicitud de Cotización",
        requestId: data.request_id,
        totalAmount: Number(data.total_amount_usd),
        unitPrice: Number(data.unit_price_usd),
        quantity: Number(data.quantity),
        deliveryTime: data.delivery_time || "No especificado",
        paymentCondition: paymentConditionOptions.find(opt => opt.id === data.payment_condition_id)?.label || "No especificado",
        deliveryMethod: deliveryMethodOptions.find(opt => opt.id === data.delivery_method_id)?.label || "A convenir",
        notes: data.notes || "Sin observaciones adicionales.",
        hasGuarantee: data.has_guarantee
    };

    const ratingMetrics = [
        { label: "Cumplimiento", value: Number(supplier.avg_compliance_seller) || 0 },
        { label: "Calidad", value: Number(supplier.avg_quality) || 0 },
        { label: "Precio", value: Number(supplier.avg_price) || 0 },
        { label: "Comunicación", value: Number(supplier.avg_communication_seller) || 0 }
    ];

    // Info blocks for the generic card
    const infoBlocks = [
        { 
            icon: <Briefcase className="w-4 h-4" />, 
            label: "Sector Comercial", 
            value: categoryOptions.find(opt => Number(opt.id) === Number(supplier.sector_ref?.id))?.label || "N/A" 
        },
        { 
            icon: <MapPin className="w-4 h-4" />, 
            label: "Ubicación", 
            value: mainHeadquarters 
                ? resolveLocation(mainHeadquarters.country_id, mainHeadquarters.state_id) 
                : "Ubicación no especificada"
        }
    ];

    return (
        <DetailLayout
            title="Detalle de Oferta"
            subtitle="Resumen"
            onBack={() => navigate(-1)}
            sidebar={
                <CompanyProfileCard 
                    company={supplier}
                    metrics={ratingMetrics}
                    infoBlocks={infoBlocks}
                    onReviewClick={() => setIsReviewModalOpen(true)}
                    action={
                        <Button 
                            variant="link" 
                            className="text-blue-600 font-bold p-0 h-auto hover:no-underline hover:text-blue-700"
                            onClick={() => navigate(`/Perfil/${quote.supplierId}`)}
                        >
                            Ver perfil del Proveedor
                        </Button>
                    }
                />
            }
            footerActions={
                <>
                    <Button 
                        variant="outline" 
                        className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-red-600 hover:border-red-100 transition-all gap-2"
                    >
                        <X className="w-4 h-4" /> Rechazar Oferta
                    </Button>
                    <Button 
                        disabled={startNegotiationMutation.isPending}
                        onClick={() => startNegotiationMutation.mutate()}
                        className="flex-[2] h-12 rounded-xl bg-[#D2FC31] hover:bg-[#c4ee2a] text-slate-900 font-black gap-2 shadow-sm border border-[#D2FC31] transition-all"
                    >
                        {startNegotiationMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <MessageSquare className="w-5 h-5" /> 
                        )}
                        Ir a Negociación
                    </Button>
                </>
            }
        >
            <Card className="border border-slate-100 bg-white shadow-sm overflow-hidden rounded-2xl">
                <CardContent className="p-6 md:p-8 space-y-8">
                    {/* Header Info */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Solicitud Relacionada: <span className="text-blue-600 cursor-pointer hover:underline ml-1 font-bold">{quote.relatedRequest}</span>
                        </p>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Precio total de la propuesta</p>
                                <h2 className="text-3xl font-bold text-slate-900">
                                    ${quote.totalAmount.toLocaleString()}
                                </h2>
                            </div>
                            <Badge className="bg-blue-50 text-blue-600 border-0 rounded-full px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest h-fit">
                                <ShieldCheck className="w-3 h-3 mr-1.5" /> Oferta Verificada
                            </Badge>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-slate-50">
                        <DetailMetric icon={Clock} label="Precio Unitario" value={`$${quote.unitPrice.toLocaleString()}`} />
                        <DetailMetric icon={CheckCircle2} label="Cantidad" value={`${quote.quantity} Unidades`} accent />
                        <DetailMetric icon={Truck} label="Entrega" value={quote.deliveryTime} />
                        <DetailMetric icon={CreditCard} label="Pago" value={quote.paymentCondition} />
                        <DetailMetric icon={Truck} label="Método" value={quote.deliveryMethod} />
                        <DetailMetric icon={Shield} label="Garantía" value={quote.hasGuarantee ? "Incluida" : "Sin Garantía"} />
                    </div>

                    {/* Notes */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Observaciones del Proveedor
                        </h4>
                        <div className="bg-slate-50/50 rounded-2xl p-6 text-slate-600 text-sm leading-relaxed border border-slate-100 font-medium italic">
                            "{quote.notes}"
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ReviewModal 
                open={isReviewModalOpen}
                onOpenChange={setIsReviewModalOpen}
                companyId={quote.supplierId}
                companyName={supplier.trade_name}
            />
        </DetailLayout>
    );
}
