import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, Star, FileText } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/ui/StatusBadge';

const unitLabels = {
    Units: 'Unidades',
    Kg: 'Kg',
    Liters: 'Litros',
    Meters: 'Metros',
    Boxes: 'Cajas',
    Pallets: 'Paletas',
    Tons: 'Toneladas',
    Gallons: 'Galones',
};
export default function ProspectDetailModal({
    open,
    onOpenChange,
    selectedSolicitud,
    onQuoteRequest,
}) {
    if (!selectedSolicitud) return null;

    const req = selectedSolicitud;
    const company = req.company || {};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh] p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
                    <DialogTitle className="text-xl font-bold text-foreground">
                        Detalle de Solicitud
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                    {/* Title + Status */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-xl text-foreground">
                                {req.product_service}
                            </h3>
                            <Badge 
                                variant="outline" 
                                className={cn(
                                    "w-fit text-[10px] px-1.5 py-0 h-4 leading-none uppercase tracking-wider font-bold",
                                    req.type === 'service' 
                                        ? "border-purple-200 bg-purple-50 text-purple-600" 
                                        : "border-blue-200 bg-blue-50 text-blue-600"
                                )}
                            >
                                {req.type === 'service' ? 'Servicio' : 'Producto'}
                            </Badge>
                        </div>
                        <StatusBadge status={req.status} />
                    </div>

                    {/* Company Info */}
                    <div className="flex items-center gap-3 bg-muted/50 p-4 rounded-xl">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {company.logo_url ? (
                                <img
                                    src={company.logo_url}
                                    alt={company.trade_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-lg font-bold text-foreground">
                                    {company.trade_name?.[0] || 'E'}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">
                                {company.trade_name || 'Empresa'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                {company.sector && <span>{company.sector}</span>}
                                {company.average_rating > 0 && (
                                    <span className="flex items-center gap-1 text-amber-600">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        {company.average_rating.toFixed(1)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Key Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Cantidad</p>
                            <p className="font-semibold text-foreground">
                                {req.quantity} {unitLabels[req.unit_of_measure] || req.unit_of_measure}
                            </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Categoría</p>
                            <p className="font-semibold text-foreground">
                                {req.category || 'General'}
                            </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Fecha de Solicitud</p>
                            <p className="font-semibold text-foreground">
                                {format(new Date(req.created_at), "d 'de' MMMM yyyy", {
                                    locale: es,
                                })}
                            </p>
                        </div>
                        {req.expiration_date && (
                            <div className="bg-amber-50 p-4 rounded-xl">
                                <p className="text-sm text-amber-600">Fecha Límite</p>
                                <p className="font-semibold text-amber-700">
                                    {format(
                                        new Date(req.expiration_date),
                                        "d 'de' MMMM yyyy",
                                        { locale: es }
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Offers count */}
                    {req.response_count > 0 && (
                        <div className="text-sm text-slate-500">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {req.response_count} oferta{req.response_count !== 1 ? 's' : ''} recibida{req.response_count !== 1 ? 's' : ''}
                            </Badge>
                        </div>
                    )}

                    {/* Description */}
                    {req.description && (
                        <div>
                            <p className="text-sm text-slate-500 mb-2 font-medium">Descripción del Requerimiento</p>
                            <p className="text-slate-700 bg-muted/50 p-4 rounded-xl text-sm leading-relaxed border border-transparent hover:border-slate-200 transition-colors">
                                {req.description}
                            </p>
                        </div>
                    )}

                    {/* Service Reach */}
                    {req.type === 'service' && req.reach_service && (
                        <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl">
                            <p className="text-sm text-purple-700 mb-2 font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400" />
                                Alcance del Servicio
                            </p>
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {req.reach_service}
                            </p>
                        </div>
                    )}

                    {/* Files */}
                    {req.files && req.files.length > 0 && (
                        <div>
                            <p className="text-sm text-slate-500 mb-2">
                                Archivos adjuntos ({req.files.length})
                            </p>
                            <div className="space-y-2">
                                {req.files.map((file) => (
                                    <a
                                        key={file.id}
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 bg-muted/50 hover:bg-blue-50 rounded-xl px-4 py-3 border border-border text-sm text-blue-600 transition-colors"
                                    >
                                        <FileText className="w-5 h-5 flex-shrink-0" />
                                        <span className="truncate">{file.file_name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cerrar
                        </Button>
                        <Button 
                            className="flex-1 bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]"
                            onClick={() => {
                                onOpenChange(false);
                                onQuoteRequest?.(req);
                            }}
                        >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Enviar Cotización
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
