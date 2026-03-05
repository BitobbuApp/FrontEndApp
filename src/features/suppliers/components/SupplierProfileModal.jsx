import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MessageSquare, BadgeCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RatingStars from '@/components/ui/RatingStars';

export default function SupplierProfileModal({
    open,
    onOpenChange,
    selectedProveedor,
}) {
    if (!selectedProveedor) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Perfil del Proveedor</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                            {selectedProveedor.logo_url ? (
                                <img
                                    src={selectedProveedor.logo_url}
                                    alt={selectedProveedor.nombre_comercial}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-[#1E293B]">
                                    {selectedProveedor.nombre_comercial?.[0] || 'P'}
                                </span>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-xl text-[#1E293B]">
                                    {selectedProveedor.nombre_comercial}
                                </h3>
                                {selectedProveedor.plan_suscripcion === 'Premium' && (
                                    <Badge className="bg-[#D2FC31] text-[#1E293B]">
                                        <BadgeCheck className="w-3 h-3 mr-1" />
                                        Verificado
                                    </Badge>
                                )}
                            </div>
                            <RatingStars rating={selectedProveedor.calificacion_promedio || 0} />
                            <p className="text-sm text-slate-500 mt-1">
                                {selectedProveedor.numero_transacciones || 0} transacciones •{' '}
                                {selectedProveedor.numero_resenas || 0} reseñas
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Sector</p>
                            <p className="font-semibold text-[#1E293B]">
                                {selectedProveedor.sector}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Tipo</p>
                            <p className="font-semibold text-[#1E293B]">
                                {selectedProveedor.tipo_empresa || 'Empresa'}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Ubicación</p>
                            <p className="font-semibold text-[#1E293B]">
                                {[
                                    selectedProveedor.ubicacion_ciudad,
                                    selectedProveedor.ubicacion_estado,
                                ]
                                    .filter(Boolean)
                                    .join(', ') || 'No especificada'}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Cobertura</p>
                            <p className="font-semibold text-[#1E293B]">
                                {selectedProveedor.cobertura_nacional ? 'Nacional' : 'Local'}
                            </p>
                        </div>
                    </div>

                    {selectedProveedor.bio && (
                        <div>
                            <p className="text-sm text-slate-500 mb-2">Acerca de</p>
                            <p className="text-slate-700">{selectedProveedor.bio}</p>
                        </div>
                    )}

                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cerrar
                        </Button>
                        <Link
                            to={
                                createPageUrl('Chat') +
                                `?proveedor=${selectedProveedor.created_by}`
                            }
                            className="flex-1"
                        >
                            <Button className="w-full bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Contactar
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
