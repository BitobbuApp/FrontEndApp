import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Package, Clock, Star, Eye, ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';

const unitLabels = {
    Units: 'Unidades', Kg: 'Kg', Liters: 'Litros', Meters: 'Metros',
    Boxes: 'Cajas', Pallets: 'Paletas', Tons: 'Toneladas', Gallons: 'Galones',
};

/**
 * Mobile card for a prospect (solicitud de otro comprador).
 * Shows: product image, company info, request details, Ver detalle button.
 */
export default function ProspectMobileCard({ req, onViewDetail }) {
    const imageUrl = req.files?.[0]?.url || null;
    const companyInitial = req.company?.trade_name?.[0] || 'E';

    const postedDate = req.created_at
        ? format(new Date(req.created_at), 'd MMM yyyy', { locale: es })
        : null;

    const deadline = req.expiration_date
        ? format(new Date(req.expiration_date), 'd MMM', { locale: es })
        : null;

    return (
        <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
            {/* Product image / placeholder */}
            <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                {imageUrl ? (
                    <img src={imageUrl} alt={req.product_service} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-300">
                        <ImageOff className="w-10 h-10" />
                        <span className="text-xs">Sin imagen</span>
                    </div>
                )}

                {/* Status */}
                <div className="absolute top-2 right-2">
                    <StatusBadge status={req.status} />
                </div>

                {/* Category pill */}
                {req.category && (
                    <div className="absolute bottom-2 left-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-background/90 text-slate-700 shadow-sm">
                            {req.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-2.5 flex-1">
                {/* Product name & Type */}
                <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-foreground text-sm leading-tight line-clamp-2 flex-1">
                        {req.product_service}
                    </p>
                    <Badge 
                        variant="outline" 
                        className={cn(
                            "text-[9px] px-1.5 py-0 h-4 leading-none uppercase tracking-wider font-bold whitespace-nowrap flex-shrink-0",
                            req.type === 'service' 
                                ? "border-purple-200 bg-purple-50 text-purple-600" 
                                : "border-blue-200 bg-blue-50 text-blue-600"
                        )}
                    >
                        {req.type === 'service' ? 'Servicio' : 'Producto'}
                    </Badge>
                </div>

                {/* Company row */}
                {req.company && (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {req.company.logo_url ? (
                                <img src={req.company.logo_url} alt={req.company.trade_name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[10px] font-bold text-slate-600">{companyInitial}</span>
                            )}
                        </div>
                        <span className="text-xs font-medium text-slate-600 truncate">{req.company.trade_name}</span>
                        {req.company.average_rating > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium ml-auto flex-shrink-0">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {req.company.average_rating.toFixed(1)}
                            </span>
                        )}
                    </div>
                )}

                {/* Meta info */}
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        {req.quantity} {unitLabels[req.unit_of_measure] || req.unit_of_measure}
                    </span>
                    {deadline && (
                        <span className="flex items-center gap-1 text-amber-600">
                            <Clock className="w-3.5 h-3.5" />
                            Hasta {deadline}
                        </span>
                    )}
                    {postedDate && (
                        <span className="text-slate-400">{postedDate}</span>
                    )}
                </div>

                {/* Description excerpt */}
                {req.description && (
                    <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                        {req.description.length > 30 
                            ? req.description.substring(0, 30) + '...' 
                            : req.description}
                    </p>
                )}

                {/* Action */}
                <Button
                    size="sm"
                    className="w-full mt-auto text-xs bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] gap-1"
                    onClick={() => onViewDetail(req)}
                >
                    <Eye className="w-3.5 h-3.5" />
                    Ver Solicitud
                </Button>
            </div>
        </div>
    );
}
