import React from 'react';
import { MapPin, Package, Star, MessageSquare, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Card layout for a supplier — used in grid view.
 * Matches mockup screenshot 1 (dark banner, avatar, badges, bio, actions).
 */
export default function SupplierCard({ company, onViewProfile }) {
    const mainLocation = company.locations?.[0] || {};
    const location = [mainLocation.location_city, mainLocation.location_state]
        .filter(Boolean).join(', ') || null;
    const initial = company.trade_name?.[0] || 'P';
    const rating = company.average_rating || 0;
    const productCount = company.products_count ?? company.transaction_count ?? 0;
    const isPremium = company.plan === 'Premium' || company.is_premium;
    const isFounder = company.is_founder;

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            {/* Banner */}
            <div className="relative h-24 bg-gradient-to-br from-slate-800 to-slate-900">
                {/* Badges */}
                <div className="absolute top-2 right-2 flex gap-1">
                    {isPremium && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#D2FC31] text-[#1E293B]">
                            ★ Premium
                        </span>
                    )}
                    {isFounder && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500 text-white">
                            Fundador
                        </span>
                    )}
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-6 left-4">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                        {company.logo_url ? (
                            <img src={company.logo_url} alt={company.trade_name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg font-bold text-[#1E293B]">{initial}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 pt-8 flex flex-col flex-1 gap-2">
                {/* Name + rating */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="font-semibold text-[#1E293B] text-sm leading-tight">{company.trade_name}</p>
                        <p className="text-xs text-slate-500">{company.company_type || 'Empresa'}</p>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-slate-700">{rating.toFixed(1)}</span>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {location}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" /> {productCount} productos
                    </span>
                </div>

                {/* Sector badge */}
                {company.sector && (
                    <Badge variant="secondary" className="text-[10px] w-fit">{company.sector}</Badge>
                )}

                {/* Bio */}
                {company.bio && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">{company.bio}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs gap-1"
                        onClick={() => onViewProfile(company)}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Ver Perfil
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1 text-xs bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d] gap-1"
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Contactar
                    </Button>
                </div>
            </div>
        </div>
    );
}
