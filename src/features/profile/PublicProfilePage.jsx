import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Star,
    FileText,
    Package,
    Users,
    Loader2,
    Phone,
    Mail,
    Globe,
    Instagram,
    Linkedin,
    Music,
    Calendar,
    BadgeCheck,
    ShieldCheck,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/atoms/Pagination';
import usePublicProfileData from './hooks/usePublicProfileData';
import useCompanyProducts from './hooks/useCompanyProducts';
import ProductSmallCard from './components/ProductSmallCard';
import { useSupplierReviews } from '@/features/suppliers/hooks/useSupplierReviews';

function getMetadataLabel(value) {
    if (typeof value === 'string') {
        return value;
    }

    if (!value || typeof value !== 'object') {
        return '';
    }

    if (typeof value.name === 'string') {
        return value.name;
    }

    if (typeof value.method === 'string') {
        return value.method;
    }

    if (value.method && typeof value.method === 'object') {
        return value.method.name || value.method.name_es || value.method.name_en || '';
    }

    return value.name_es || value.name_en || '';
}

export default function PublicProfilePage() {
    const navigate = useNavigate();

    const {
        company,
        isLoading,
        isMyProfile,
        initial,
        tradeName,
        sector,
        companyType,
        location,
        rating,
        totalReviews,
        transactions,
        products,
        trustScore,
    } = usePublicProfileData();

    const { data: companyProducts = [], isLoading: isLoadingProducts } = useCompanyProducts(company?.id);
    
    const [reviewPage, setReviewPage] = React.useState(1);
    const reviewsLimit = 5;
    const { reviews, total: totalReviewsCount, totalPages: reviewsTotalPages, loading: isLoadingReviews } = useSupplierReviews(company?.id, reviewPage, reviewsLimit);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!company) {
        return (
            <div className="text-center py-20 text-slate-500">
                No se encontro el perfil de la empresa.
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-slate-500">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
            </div>

            <div className="relative">
                <div className="h-36 w-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900" />
                <div className="absolute -bottom-8 left-6">
                    <div className="w-20 h-20 rounded-full bg-background border-4 border-white shadow flex items-center justify-center overflow-hidden">
                        {company.logo_url ? (
                            <img src={company.logo_url} alt={tradeName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-slate-700">{initial}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-12 pb-5 px-1">
                <h1 className="text-2xl font-bold text-foreground">{tradeName}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {companyType && <Badge variant="secondary" className="text-xs">{companyType}</Badge>}
                    {sector && <Badge variant="outline" className="text-xs">{sector}</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
                    {location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {location}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {rating.toFixed(1)} ({totalReviews} reseñas)
                    </span>
                    <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {transactions} transacciones
                    </span>
                </div>
                {company.bio && (
                    <p className="text-sm text-slate-600 mt-3 max-w-2xl">{company.bio}</p>
                )}
            </div>

            {/* ── Trust Score ── */}
            <Card className="border border-border shadow-sm overflow-hidden bg-slate-50/50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-[#a8d92a]" />
                            <h3 className="font-semibold text-foreground text-lg">Nivel de Confianza</h3>
                        </div>
                        <span className="font-bold text-xl">{trustScore}%</span>
                    </div>
                    <Progress value={trustScore} className="h-3 mb-2" />
                    <p className="text-sm text-slate-500">
                        {trustScore >= 100 
                            ? 'Este perfil esta verificado y completo. Es altamente confiable.' 
                            : 'Este perfil no esta completo. Sugerimos tomar precauciones al hacer negocios.'}
                    </p>
                </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
                <CardContent className="p-6 space-y-5">
                    <h3 className="text-base font-semibold text-foreground">Contacto y Redes</h3>

                    {location && (
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground text-sm">{location}</p>
                                {company.locations?.[0]?.national_coverage && (
                                    <span className="inline-block mt-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Cobertura Nacional</span>
                                )}
                            </div>
                        </div>
                    )}

                    {company.founding_year && (
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <p className="text-sm text-foreground">Fundada en {company.founding_year}</p>
                        </div>
                    )}

                    {(() => {
                        const contact = company.contacts?.[0] || {};
                        const links = [
                            company.website && { icon: Globe, label: 'Sitio Web', href: company.website },
                            company.instagram && { icon: Instagram, label: 'Instagram', href: `https://instagram.com/${company.instagram.replace('@', '')}` },
                            company.linkedin && { icon: Linkedin, label: 'LinkedIn', href: company.linkedin },
                            company.tiktok && { icon: Music, label: 'TikTok', href: `https://tiktok.com/@${company.tiktok.replace('@', '')}` },

                        ].filter(Boolean);

                        if (!links.length) return null;

                        return (
                            <div className="grid grid-cols-2 gap-2">
                                {links.map(({ icon: Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border text-sm text-slate-700 hover:bg-muted/50 transition-colors"
                                    >
                                        <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                        {label}
                                    </a>
                                ))}
                            </div>
                        );
                    })()}

                    <div className="border-t border-border" />

                    {company.commercial_profile?.works_with_credit && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <BadgeCheck className="w-4 h-4" />
                            Trabaja con credito
                        </div>
                    )}

                    {company.payment_methods?.length > 0 && (
                        <div>
                            <p className="text-xs text-slate-400 mb-2">Metodos de pago:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {company.payment_methods.map((pm) => (
                                    <span
                                        key={getMetadataLabel(pm) || JSON.stringify(pm)}
                                        className="inline-block text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                                    >
                                        {getMetadataLabel(pm)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: Package, label: 'Productos', value: products, color: 'text-blue-500' },
                    { icon: Users, label: 'Transacciones', value: transactions, color: 'text-purple-500' },
                    { icon: Star, label: 'Calificacion', value: rating.toFixed(1), color: 'text-amber-500' },
                    { icon: FileText, label: 'Reseñas', value: totalReviews, color: 'text-slate-400' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <Card key={label} className="border border-border shadow-sm">
                        <CardContent className="p-5 flex flex-col items-center gap-2 text-center">
                            <Icon className={`w-7 h-7 ${color}`} />
                            <p className="text-2xl font-bold text-foreground">{value}</p>
                            <p className="text-xs text-slate-500">{label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="resenas">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="vitrina">Vitrina</TabsTrigger>
                    <TabsTrigger value="resenas">Reseñas</TabsTrigger>
                </TabsList>

                <TabsContent value="vitrina" className="mt-4">
                    {isLoadingProducts ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                        </div>
                    ) : companyProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {companyProducts.map((p) => (
                                <ProductSmallCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-sm">
                            <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <Package className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="font-medium text-slate-600">Vitrina vacia</p>
                                <p className="text-sm text-slate-400">Esta empresa aun no tiene productos publicados</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="resenas" className="mt-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            {isLoadingReviews ? (
                                <div className="py-12 flex justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                                </div>
                            ) : reviews.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-border overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50/50">
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead className="w-[200px] text-xs font-semibold uppercase tracking-wider text-slate-500 py-4 px-6">Empresa</TableHead>
                                                    <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wider text-slate-500 py-4 text-center">Calificación</TableHead>
                                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 py-4 px-6">Comentario</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {reviews.map((review, index) => (
                                                    <TableRow key={review.id || index} className="group hover:bg-slate-50 transition-colors border-slate-100">
                                                        <TableCell className="py-4 px-6">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-slate-900 text-sm">
                                                                    {review.author?.trade_name || 'Empresa anónima'}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
                                                                    {review.created_at
                                                                        ? new Date(review.created_at).toLocaleDateString('es-VE', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                        })
                                                                        : 'Reciente'}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4 text-center">
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600">
                                                                <Star className="w-3.5 h-3.5 fill-amber-500" />
                                                                <span className="text-xs font-bold leading-none">
                                                                    {Number(review.rating || 0).toFixed(1)}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4 px-6">
                                                            <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                                                "{review.comment || 'Sin comentarios adicionales.'}"
                                                            </p>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <Pagination
                                            totalItems={totalReviewsCount}
                                            itemsLabel="reseña"
                                            itemsLabelPlural="reseñas"
                                            currentPage={reviewPage}
                                            totalPages={reviewsTotalPages}
                                            onPageChange={setReviewPage}
                                            className="bg-slate-50/30"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="py-16 flex flex-col items-center gap-3 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                        <Star className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="font-medium text-slate-600">Sin reseñas aun</p>
                                    <p className="text-sm text-slate-400">Esta empresa no ha recibido reseñas todavia</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
