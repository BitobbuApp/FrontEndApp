import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Star,
    Package,
    Loader2,
    Calendar,
} from 'lucide-react';
import tooltips from '@/constants/tooltips.json';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import CompanySubcategories from './components/CompanySubcategories';
import { StatsStrip, TrustCard, CommercialCard, SocialCard } from './components/ProfileCards';
import { useSupplierReviews } from '@/features/suppliers/hooks/useSupplierReviews';
import { useMyCompany } from '@/features/settings/hooks/useMyCompany';
import { buildDirectOffer } from '@/features/marketplace/utils/directOffer';

const SECTION_TABS = [
    { value: 'vitrina', label: 'Vitrina' },
    { value: 'resenas', label: 'Reseñas' },
];

export default function PublicProfilePage() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = React.useState('resenas');

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

    const { data: myCompany } = useMyCompany();
    const canRequestQuote = !isMyProfile && !!myCompany?.can_buy;

    const handleRequestQuote = (product) => {
        navigate('/Requests/new', {
            state: { offer: buildDirectOffer(product, tradeName) },
        });
    };

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
                No se encontró el perfil de la empresa.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-slate-500">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
            </div>

            {/* ── Header card: banner, identity, stats ── */}
            <Card className="overflow-hidden rounded-3xl border border-border shadow-sm">
                <div className="h-32 bg-gradient-to-br from-[#0B2046] via-[#0F2858] to-[#1c3a4f] sm:h-40" />

                <div className="px-6 pb-6 sm:px-10">
                    <div className="-mt-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-white shadow-lg sm:-mt-14 sm:h-28 sm:w-28">
                        {company.logo_url ? (
                            <img src={company.logo_url} alt={tradeName} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-[#0B2046]">{initial}</span>
                        )}
                    </div>

                    <div className="mt-4 space-y-4 sm:mt-5">
                        <h1 className="text-3xl font-bold text-[#0B2046] sm:text-4xl">{tradeName}</h1>

                        <div className="flex flex-wrap items-center gap-2">
                            {companyType && (
                                <Badge className="rounded-full bg-[#0B2046] px-3 py-1 text-sm font-semibold text-white hover:bg-[#0B2046]">
                                    {companyType}
                                </Badge>
                            )}
                            {sector && (
                                <Badge className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-[#0B2046] hover:bg-slate-100">
                                    {sector}
                                </Badge>
                            )}
                        </div>

                        <CompanySubcategories
                            subcategories={company?.subcategories_of_interest}
                            editable={isMyProfile}
                        />

                        {(company.founding_year || location) && (
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-600">
                                {company.founding_year && (
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        Fundada en {company.founding_year}
                                    </span>
                                )}
                                {location && (
                                    <span className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        {location}
                                        {company.locations?.[0]?.national_coverage && (
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                                Cobertura nacional
                                            </span>
                                        )}
                                    </span>
                                )}
                            </div>
                        )}

                        {company.bio && (
                            <p className="max-w-3xl leading-relaxed text-slate-600">{company.bio}</p>
                        )}
                    </div>
                </div>

                <StatsStrip
                    products={products}
                    transactions={transactions}
                    score={rating}
                    reviews={totalReviews}
                    tooltips={tooltips.profile}
                />
            </Card>

            {/* ── Sidebar cards + vitrina / reseñas ── */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_2fr]">
                <div className="space-y-6">
                    <TrustCard trustScore={trustScore} info={tooltips.profile.trust_score} />
                    <CommercialCard company={company} isOwner={isMyProfile} />
                    <SocialCard company={company} />
                </div>

                <div className="space-y-4">
                    <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
                        {SECTION_TABS.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setActiveSection(value)}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                                    activeSection === value
                                        ? 'bg-white text-[#0B2046] shadow-sm'
                                        : 'text-slate-500 hover:text-[#0B2046]'
                                }`}
                            >
                                {label}
                                <span className="ml-1.5 text-slate-500">
                                    {value === 'vitrina' ? companyProducts.length : totalReviews}
                                </span>
                            </button>
                        ))}
                    </div>

                    {activeSection === 'vitrina' && (
                        isLoadingProducts ? (
                            <div className="py-12 flex justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                            </div>
                        ) : companyProducts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {companyProducts.map((p) => (
                                    <ProductSmallCard
                                        key={p.id}
                                        product={p}
                                        onRequestQuote={canRequestQuote ? handleRequestQuote : undefined}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="rounded-3xl border border-border shadow-sm">
                                <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                        <Package className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="text-lg font-semibold text-[#0B2046]">Vitrina vacía</p>
                                    <p className="text-slate-500">Esta empresa aún no tiene productos publicados</p>
                                </CardContent>
                            </Card>
                        )
                    )}

                    {activeSection === 'resenas' && (
                        <Card className="rounded-3xl border border-border shadow-sm">
                            <CardContent className="p-6">
                                {isLoadingReviews ? (
                                    <div className="py-12 flex justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                                    </div>
                                ) : reviews.length > 0 ? (
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
                                ) : (
                                    <div className="py-16 flex flex-col items-center gap-3 text-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                            <Star className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <p className="text-lg font-semibold text-[#0B2046]">Sin reseñas aún</p>
                                        <p className="text-slate-500">Esta empresa no ha recibido reseñas todavía</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
