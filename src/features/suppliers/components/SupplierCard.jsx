import React from 'react';
import { MapPin, Package, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Card layout for a supplier — used in grid view.
 * Avatar + name/type/sector, key metrics, bio and a "Ver perfil" action.
 */
export default function SupplierCard({ company, onViewProfile }) {
    const mainLocation = company.locations?.[0] || {};
    const location = [
        mainLocation.city?.name,
        mainLocation.state?.name,
        mainLocation.location_city,
        mainLocation.location_state,
    ]
        .filter(Boolean).join(', ') || null;
    const initial = company.trade_name?.[0] || 'P';
    const rating = company.average_rating || 0;
    const reviewCount = company.review_count ?? company.total_reviews ?? 0;
    const productCount = company.product_count ?? 0;
    const transactionCount = company.transaction_count ?? 0;
    const isPremium = company.plan === 'Premium' || company.is_premium;
    const isFounder = company.is_founder;

    return (
        <div className="bg-background rounded-3xl border border-border shadow-sm flex flex-col p-6 gap-4">
            {/* Identity */}
            <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {company.logo_url ? (
                        <img src={company.logo_url} alt={company.trade_name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-2xl font-bold text-[#0B2046]">{initial}</span>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-lg leading-tight text-[#0B2046]">{company.trade_name}</p>
                        {isPremium && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#D2FC31] text-slate-900">
                                ★ Premium
                            </span>
                        )}
                        {isFounder && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500 text-white">
                                Fundador
                            </span>
                        )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span>{company.company_type || 'Empresa'}</span>
                        {company.sector && (
                            <>
                                <span className="text-slate-300">·</span>
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-[#0B2046]">
                                    {company.sector}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-[#0B2046]">{rating.toFixed(1)}</span>
                    ({reviewCount} reseñas)
                </span>
                {location && (
                    <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {location}
                    </span>
                )}
                <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-[#0B2046]">{transactionCount} transacciones</span>
                </span>
                <span className="flex w-full items-center gap-1.5">
                    <Package className="w-4 h-4" /> {productCount} productos
                </span>
            </div>

            {/* Bio */}
            {company.bio && (
                <p className="text-slate-600 leading-relaxed line-clamp-2">{company.bio}</p>
            )}

            {/* Actions */}
            <div className="mt-auto flex justify-end border-t border-border pt-4">
                <Button
                    variant="secondary"
                    className="gap-2 rounded-xl font-semibold text-[#0B2046]"
                    onClick={() => onViewProfile(company)}
                >
                    Ver perfil
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
