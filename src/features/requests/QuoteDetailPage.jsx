import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, Star, ShieldCheck, MapPin, 
    Briefcase, User, MessageSquare, X, 
    ImageIcon, FileText, CheckCircle2, Clock, 
    CreditCard, Truck, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { useQuery } from '@tanstack/react-query';
import { quoteResponsesApi } from './services/quoteResponsesApi';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';
import { Loader2, AlertCircle } from 'lucide-react';

export default function QuoteDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
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

    // Internal mapping
    const quote = {
        id: data.id,
        supplierId: data.supplier_id,
        relatedRequest: data.request?.product_service || "Solicitud de Cotización",
        requestId: data.request_id,
        totalAmount: Number(data.total_amount),
        unitPrice: Number(data.unit_price),
        quantity: Number(data.quantity),
        deliveryTime: data.delivery_time || "No especificado",
        paymentCondition: paymentConditionOptions.find(opt => opt.id === data.payment_condition_id)?.label || "No especificado",
        deliveryMethod: deliveryMethodOptions.find(opt => opt.id === data.delivery_method_id)?.label || "A convenir",
        notes: data.notes || "Sin observaciones adicionales.",
        hasGuarantee: data.has_guarantee,
        supplier: {
            name: supplier.trade_name || "Proveedor",
            initials: supplier.trade_name?.[0]?.toUpperCase() || "S",
            verified: true, // Placeholder for verified status
            rating: Number(supplier.average_rating) || 0,
            reviewCount: supplier.review_count || 0,
            sector: categoryOptions.find(opt => Number(opt.id) === Number(supplier.sector_ref?.id))?.label || "N/A",
            location: mainHeadquarters 
                ? resolveLocation(mainHeadquarters.country_id, mainHeadquarters.state_id) 
                : "Ubicación no especificada",
            bio: supplier.bio || "Este proveedor no ha proporcionado una biografía todavía.",
            badges: [
                `${supplier.review_count || 0} reseñas`,
                supplier.company_type || "Empresa",
                "Verificado"
            ],
            detailedRatings: [
                { label: "Cumplimiento", score: Number(supplier.average_rating) || 0 },
                { label: "Calidad", score: Number(supplier.average_rating) || 0 },
                { label: "Precio", score: 0 }, // Hardcoded for now until backend provides specific dimensions
                { label: "Comunicación", score: 0 }
            ]
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header / Navigation */}
            <header className="flex items-center gap-4 mb-8">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate(-1)}
                    className="hover:bg-slate-100 rounded-full"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Button>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Detalle de Oferta</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Main Content (Left/Center) ── */}
                <div className="lg:col-span-2 space-y-5">
                    <Card className="border-0 shadow-sm overflow-hidden bg-white rounded-xl">
                        <CardContent className="p-6 md:p-8">
                            <div className="space-y-6">
                                {/* Related Request */}
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 mb-1">
                                        Solicitud Relacionada: <span className="text-blue-600 cursor-pointer hover:underline ml-1 font-bold">{quote.relatedRequest}</span>
                                    </p>
                                    <div className="mt-4">
                                        <p className="text-xs text-slate-500 mb-1">Precio total de la propuesta</p>
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            ${quote.totalAmount.toLocaleString()}
                                        </h2>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 py-5 border-y border-slate-50">
                                    <MetricItem icon={<Clock className="w-4 h-4" />} label="Precio Unitario" value={`$${quote.unitPrice.toLocaleString()}`} />
                                    <MetricItem icon={<CheckCircle2 className="w-4 h-4" />} label="Cantidad" value={`${quote.quantity} Unidades`} />
                                    <MetricItem icon={<Truck className="w-4 h-4" />} label="Tiempo de Entrega" value={quote.deliveryTime} />
                                    <MetricItem icon={<CreditCard className="w-4 h-4" />} label="Condiciones de Pago" value={quote.paymentCondition} />
                                    <MetricItem icon={<Truck className="w-4 h-4" />} label="Método de Envío" value={quote.deliveryMethod} />
                                    <MetricItem icon={<Shield className="w-4 h-4" />} label="Garantía" value={quote.hasGuarantee ? "Incluida" : "Sin Garantía"} />
                                </div>

                                {/* Notes Section */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        Descripción / Notas del Proveedor
                                    </h4>
                                    <div className="bg-slate-50 rounded-2xl p-6 text-slate-600 text-sm leading-relaxed border border-slate-100 italic">
                                        "{quote.notes}"
                                    </div>
                                </div>

                                {/* Reference Images */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-slate-400" />
                                        Imágenes de Referencia
                                    </h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                                                <ImageIcon className="w-6 h-6 text-slate-300 group-hover:text-blue-300 transition-colors" />
                                                <span className="text-[10px] font-medium text-slate-400">Ref {i}.jpg</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer Actions */}
                    <div className="flex gap-4">
                        <Button 
                            variant="outline" 
                            className="flex-1 h-11 rounded-xl border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-red-600 hover:border-red-100 transition-all gap-2"
                        >
                            <X className="w-4 h-4" /> Rechazar Oferta
                        </Button>
                        <Button 
                            className="flex-[2] h-11 rounded-xl bg-[#D2FC31] hover:bg-[#c4ee2a] text-slate-900 font-bold text-sm gap-2 shadow-sm border border-[#D2FC31] transition-all"
                        >
                            <MessageSquare className="w-5 h-5" /> Ir a Negociación
                        </Button>
                    </div>
                </div>

                {/* ── Sidebar (Right) ── */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-sm bg-white rounded-xl overflow-hidden">
                        <CardContent className="p-6 space-y-6">
                            {/* Supplier Profile Info */}
                            <div className="text-center">
                                <div className="inline-flex w-16 h-16 bg-[#D2FC31] rounded-xl items-center justify-center text-slate-900 text-xl font-bold shadow-inner mb-3">
                                    {quote.supplier.initials}
                                </div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center justify-center gap-1.5">
                                    {quote.supplier.name}
                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                </h3>
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const rating = quote.supplier.rating;
                                        const isFull = star <= Math.floor(rating);
                                        const isHalf = !isFull && star <= Math.ceil(rating) && (rating % 1 !== 0);
                                        
                                        return (
                                            <Star 
                                                key={star} 
                                                className={`w-3.5 h-3.5 ${
                                                    isFull 
                                                        ? 'fill-amber-400 text-amber-400' 
                                                        : isHalf 
                                                            ? 'fill-amber-400/50 text-amber-400' 
                                                            : 'fill-slate-100 text-slate-200'
                                                }`} 
                                            />
                                        );
                                    })}
                                    <span className="text-xs font-black text-slate-900 ml-1.5">{quote.supplier.rating.toFixed(1)}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{quote.supplier.reviewCount} Reseñas</span>
                                </div>
                                <Button 
                                    variant="link" 
                                    className="text-blue-600 font-bold p-0 mt-2 hover:no-underline hover:text-blue-700"
                                    onClick={() => navigate(`/Perfil/${quote.supplierId}`)}
                                >
                                    Ver perfil
                                </Button>
                            </div>

                            {/* Detailed Rating */}
                            <div className="space-y-3 py-5 border-y border-slate-50">
                                <p className="text-xs font-semibold text-slate-400 px-1">Calificación Detallada</p>
                                <div className="space-y-3">
                                    {[
                                        { label: "Cumplimiento", key: 'rating' },
                                        { label: "Calidad", key: 'rating' },
                                        { label: "Precio", key: 'rating' },
                                        { label: "Comunicación", key: 'rating' }
                                    ].map((metric, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium text-slate-600">
                                                <span>{metric.label}</span>
                                                <span className="text-slate-900 font-semibold">{quote.supplier.rating.toFixed(1)}</span>
                                            </div>
                                            <Progress value={quote.supplier.rating * 20} className="h-1 bg-slate-100" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Stats Badges */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {quote.supplier.badges.map((badge, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-600 border-0 rounded-full py-1.5 px-4 font-bold text-[10px]">
                                        {badge}
                                    </Badge>
                                ))}
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-6 pt-4">
                                <InfoBlock icon={<Briefcase className="w-4 h-4" />} label="Sector Comercial" value={quote.supplier.sector} />
                                <InfoBlock icon={<MapPin className="w-4 h-4" />} label="Ubicación" value={quote.supplier.location} />
                                <div className="space-y-2 px-1 text-center md:text-left">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                                        <User className="w-3.5 h-3.5" /> Biografía
                                    </p>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                        {quote.supplier.bio}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function MetricItem({ icon, label, value }) {
    return (
        <div className="space-y-0.5">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-sm font-semibold text-slate-900">{value}</p>
        </div>
    );
}

function InfoBlock({ icon, label, value }) {
    return (
        <div className="flex flex-col items-center md:items-start gap-2 group px-1">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <span className="p-1 rounded-md bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-400 transition-colors">{icon}</span>
                {label}
            </p>
            <p className="text-sm font-black text-slate-800 ml-0 md:ml-7">{value}</p>
        </div>
    );
}
