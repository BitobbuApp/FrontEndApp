import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';

export default function ProspectDetailModal({
    open,
    onOpenChange,
    selectedSolicitud,
}) {
    if (!selectedSolicitud) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detalle de Solicitud</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-xl text-[#1E293B]">
                            {selectedSolicitud.producto_servicio}
                        </h3>
                        <StatusBadge status={selectedSolicitud.estado} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Cantidad</p>
                            <p className="font-semibold text-[#1E293B]">
                                {selectedSolicitud.cantidad} {selectedSolicitud.unidad_medida}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Categoría</p>
                            <p className="font-semibold text-[#1E293B]">
                                {selectedSolicitud.categoria || 'General'}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Fecha de Solicitud</p>
                            <p className="font-semibold text-[#1E293B]">
                                {format(new Date(selectedSolicitud.created_date), 'd MMMM yyyy', {
                                    locale: es,
                                })}
                            </p>
                        </div>
                        {selectedSolicitud.fecha_vencimiento && (
                            <div className="bg-amber-50 p-4 rounded-xl">
                                <p className="text-sm text-amber-600">Fecha Límite</p>
                                <p className="font-semibold text-amber-700">
                                    {format(
                                        new Date(selectedSolicitud.fecha_vencimiento),
                                        'd MMMM yyyy',
                                        { locale: es }
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    {selectedSolicitud.descripcion && (
                        <div>
                            <p className="text-sm text-slate-500 mb-2">Descripción</p>
                            <p className="text-slate-700 bg-slate-50 p-4 rounded-xl">
                                {selectedSolicitud.descripcion}
                            </p>
                        </div>
                    )}

                    <div className="flex gap-2 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cerrar
                        </Button>
                        <Link
                            to={createPageUrl('Chat') + `?cliente=${selectedSolicitud.created_by}`}
                            className="flex-1"
                        >
                            <Button className="w-full bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Contactar Cliente
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
