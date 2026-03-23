import React from 'react';
import { MapPin, Star, Eye, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Compact row layout for a supplier — used in list view.
 * Matches mockup screenshot 2 (avatar initial, name + meta inline, action icons).
 */
export default function SupplierRow({ company, onViewProfile }) {
    const mainLocation = company.locations?.[0] || {};
    const location = mainLocation.location_state || null;
    const initial = company.trade_name?.[0] || 'P';
    const rating = company.average_rating || 0;
    const isPremium = company.plan === 'Premium' || company.is_premium;

    return (
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {company.logo_url ? (
                    <img src={company.logo_url} alt={company.trade_name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-base font-bold text-[#1E293B]">{initial}</span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-sm text-[#1E293B] truncate">{company.trade_name}</p>
                    {isPremium && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#D2FC31] text-[#1E293B]">
                            ★ Premium
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                    {company.sector && <Badge variant="secondary" className="text-[10px]">{company.sector}</Badge>}
                    {location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {location}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-amber-500 font-medium">
                        <Star className="w-3 h-3 fill-amber-400" /> {rating.toFixed(1)}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => onViewProfile(company)}
                    title="Ver perfil"
                >
                    <Eye className="w-4 h-4" />
                </Button>
                <Button
                    size="icon"
                    className="w-8 h-8 bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
                    title="Contactar"
                >
                    <MessageSquare className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
