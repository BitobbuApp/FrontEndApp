import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Package, Clock, Eye, Pause, Play, Trash2, ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import { useNavigate } from 'react-router-dom';

const unitLabels = {
    Units: 'Unidades', Kg: 'Kg', Liters: 'Litros', Meters: 'Metros',
    Boxes: 'Cajas', Pallets: 'Paletas', Tons: 'Toneladas', Gallons: 'Galones',
};

/**
 * Mobile card for a single request (solicitud propia).
 * Shows: product image (or placeholder), name, status, qty, category, deadline, offers.
 */
export default function RequestMobileCard({ req, onTogglePause, onDelete }) {
    const navigate = useNavigate();
    const imageUrl = req.files?.[0]?.url || null;
    const deadline = req.expiration_date
        ? format(new Date(req.expiration_date), 'd MMM yyyy', { locale: es })
        : format(new Date(new Date(req.created_at).getTime() + 30 * 24 * 60 * 60 * 1000), 'd MMM yyyy', { locale: es });

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

                {/* Status badge overlay */}
                <div className="absolute top-2 right-2">
                    <StatusBadge status={req.status} />
                </div>

                {/* Offers pill overlay */}
                {(req.response_count > 0) && (
                    <div className="absolute bottom-2 left-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#D2FC31] text-slate-900">
                            {req.response_count} {req.response_count === 1 ? 'oferta' : 'ofertas'}
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-2.5 flex-1">
                <div>
                    <p className="font-semibold text-foreground text-sm leading-tight">{req.product_service}</p>
                    {req.category && (
                        <Badge variant="secondary" className="text-[10px] mt-1">{req.category}</Badge>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        {req.quantity} {unitLabels[req.unit_of_measure] || req.unit_of_measure}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                        <Clock className="w-3.5 h-3.5" />
                        {deadline}
                    </span>
                </div>

                {req.best_offer_amount && (
                    <p className="text-sm font-semibold text-emerald-600">
                        Mejor oferta: ${Number(req.best_offer_amount).toLocaleString()}
                    </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs gap-1"
                        onClick={() => navigate(`/Requests/${req.id}/summary`)}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Ver detalle
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 flex-shrink-0"
                        onClick={() => onTogglePause(req)}
                        disabled={['Completed', 'Expired', 'Closed'].includes(req.status)}
                        title={req.status === 'Paused' ? 'Reanudar' : 'Pausar'}
                    >
                        {req.status === 'Paused'
                            ? <Play className="w-4 h-4 text-emerald-600" />
                            : <Pause className="w-4 h-4 text-slate-400" />
                        }
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 flex-shrink-0 hover:text-red-500"
                        onClick={() => onDelete(req.id)}
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4 text-slate-400" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
