import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar,
    Clock,
    FileText,
    MessageSquare,
    Package,
    AlertCircle,
    UserRoundSearch,
    MapPin,
    Briefcase
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import EmptyState from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

// Shared Components
import DetailLayout from '@/components/layout/DetailLayout';
import DetailMetric from '@/components/shared/DetailMetric';
import CompanyProfileCard from '@/components/shared/CompanyProfileCard';

// Local Feature Components
import QuoteResponseModal from './components/QuoteResponseModal';
import ReviewModal from '@/features/suppliers/components/ReviewModal';
import { useProspectDetail } from './hooks/useProspectDetail';
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
    'Unit(s)': 'Unidades'
};

export default function ProspectDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const initialProspect = location.state?.prospect || null;
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const { resolveLocation } = useAppMetadata();

    const { prospect, isLoading, isError } = useProspectDetail(id, initialProspect);

    if (isLoading && !prospect) {
        return <ProspectDetailSkeleton />;
    }

    if (isError) {
        return (
            <div className="max-w-5xl mx-auto py-12">
                <EmptyState
                    icon={AlertCircle}
                    title="No pudimos cargar la solicitud"
                    description="Intenta nuevamente o regresa a la lista de posibles clientes."
                    actionLabel="Volver a leads"
                    onAction={() => navigate('/PosiblesClientes')}
                />
            </div>
        );
    }

    if (!prospect) {
        return (
            <div className="max-w-5xl mx-auto py-12">
                <EmptyState
                    icon={UserRoundSearch}
                    title="Solicitud no encontrada"
                    description="Este lead no está disponible o dejó de estar activo en el marketplace."
                    actionLabel="Volver a leads"
                    onAction={() => navigate('/PosiblesClientes')}
                />
            </div>
        );
    }

    const company = prospect.company || {};
    
    const ratingMetrics = [
        { label: "Cumplimiento", value: Number(company.avg_compliance_buyer) || 0 },
        { label: "Comunicación", value: Number(company.avg_communication_buyer) || 0 },
        { label: "Confiabilidad", value: Number(company.avg_reliability) || 0 }
    ];

    // Info blocks for the sidebar
    const locationString = company?.locations?.[0] 
        ? resolveLocation(company.locations[0].country_id, company.locations[0].state_id) 
        : "No especificada";

    const infoBlocks = [
        { icon: <Briefcase className="w-4 h-4" />, label: "Sector", value: company.sector || "N/A" },
        { icon: <MapPin className="w-4 h-4" />, label: "Ubicación", value: locationString }
    ];

    return (
        <>
            <DetailLayout
                title="Detalle de Solicitud"
                subtitle="Resumen"
                onBack={() => navigate('/PosiblesClientes')}
                footerActions={
                    <Button
                        className="w-full h-12 rounded-xl bg-[#D2FC31] px-6 text-slate-900 hover:bg-[#c4ed2d] font-bold shadow-sm transition-all"
                        onClick={() => setQuoteModalOpen(true)}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Cotizar
                    </Button>
                }
                sidebar={
                    <CompanyProfileCard 
                        company={company}
                        metrics={ratingMetrics}
                        infoBlocks={infoBlocks}
                        onReviewClick={() => setIsReviewModalOpen(true)}
                        action={
                            <Button 
                                variant="link" 
                                className="text-blue-600 font-bold p-0 h-auto hover:no-underline hover:text-blue-700"
                                onClick={() => navigate(`/Perfil/${company.id}`)}
                            >
                                Ver perfil del Comprador
                            </Button>
                        }
                    />
                }
            >
                {/* --- Main Proposal Content --- */}
                <Card className="border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-sm overflow-hidden rounded-2xl">
                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="flex flex-col gap-5">
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'text-[10px] px-2.5 py-1 uppercase tracking-[0.18em] font-semibold',
                                            prospect.type === 'service'
                                                ? 'border-purple-200 bg-purple-50 text-purple-700'
                                                : 'border-slate-200 bg-white text-slate-700'
                                        )}
                                    >
                                        {prospect.type === 'service' ? 'Servicio' : 'Producto'}
                                    </Badge>
                                    {prospect.category && (
                                        <Badge className="bg-slate-900 text-slate-50 border-0 rounded-full px-3 py-1 font-bold text-[10px]">
                                            {prospect.category}
                                        </Badge>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-950 leading-tight">
                                    {prospect.product_service}
                                </h2>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <DetailMetric
                                    icon={Package}
                                    label="Cantidad"
                                    value={`${prospect.quantity || '-'} ${unitLabels[prospect.unit_of_measure] || prospect.unit_of_measure || ''}`.trim()}
                                    accent
                                />
                                <DetailMetric
                                    icon={Calendar}
                                    label="Publicado"
                                    value={formatDate(prospect.created_at)}
                                />
                                <DetailMetric
                                    icon={Clock}
                                    label="Cierre"
                                    value={formatDate(prospect.expiration_date, 'Sin fecha límite')}
                                />
                                <DetailMetric
                                    icon={FileText}
                                    label="Ofertas"
                                    value={`${prospect.response_count || 0} recibidas`}
                                />
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-xl bg-[#D2FC31]/40 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-slate-900" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-widest">
                                    Descripción del Requerimiento
                                </h3>
                            </div>
                            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 text-sm leading-relaxed text-slate-600 font-medium italic">
                                "{prospect.description || 'El comprador no agregó una descripción adicional.'}"
                            </div>
                        </div>

                        {prospect.type === 'service' && prospect.reach_service && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-widest">
                                    Alcance del Servicio
                                </h3>
                                <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm leading-relaxed text-slate-700">
                                    {prospect.reach_service}
                                </div>
                            </div>
                        )}

                        {prospect.files?.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-widest">
                                    Archivos y Documentos
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {prospect.files.map((file) => (
                                        <a
                                            key={file.id}
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group relative flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-[#D2FC31] hover:bg-[#D2FC31]/5 transition-all"
                                        >
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#D2FC31]/20 group-hover:text-slate-600 transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-slate-900 text-sm">{file.file_name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 group-hover:text-slate-500">Abrir Documento</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DetailLayout>

            <QuoteResponseModal
                open={quoteModalOpen}
                onOpenChange={setQuoteModalOpen}
                request={prospect}
            />

            <ReviewModal 
                open={isReviewModalOpen}
                onOpenChange={setIsReviewModalOpen}
                companyId={company.id}
                companyName={company.trade_name}
                typeLabel="comprador"
            />
        </>
    );
}

function ProspectDetailSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
                <div className="space-y-2">
                    <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
                    <div className="h-7 w-56 rounded bg-slate-200 animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-8 space-y-5">
                            <div className="h-8 w-64 rounded bg-slate-200 animate-pulse" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-8 space-y-3">
                            <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
                            <div className="h-28 w-full rounded-3xl bg-slate-100 animate-pulse" />
                            <div className="h-28 w-full rounded-3xl bg-slate-100 animate-pulse" />
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="mx-auto h-20 w-20 rounded-3xl bg-slate-200 animate-pulse" />
                        <div className="h-5 w-40 mx-auto rounded bg-slate-200 animate-pulse" />
                        <div className="h-12 w-full rounded-xl bg-slate-100 animate-pulse" />
                        <div className="h-12 w-full rounded-xl bg-slate-100 animate-pulse" />
                        <div className="h-12 w-full rounded-xl bg-slate-100 animate-pulse" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function formatDate(dateValue, fallback = '-') {
    if (!dateValue) return fallback;
    try {
        return format(new Date(dateValue), "d 'de' MMMM yyyy", { locale: es });
    } catch (e) {
        return fallback;
    }
}
