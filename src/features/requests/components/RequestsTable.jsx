import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
    Eye,
    Pause,
    Play,
    ChevronDown,
    ChevronUp,
    MessageSquare,
    Check,
    FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import StatusBadge from '@/components/ui/StatusBadge';
import RatingStars from '@/components/ui/RatingStars';
import EmptyState from '@/components/ui/EmptyState';

export default function RequestsTable({
    solicitudes,
    isLoading,
    expandedRow,
    onExpandRow,
    getOfertasBySolicitud,
    onTogglePause,
    onNewSolicitud,
    user,
    myCompany,
    searchTerm,
    statusFilter,
}) {
    if (isLoading) {
        return (
            <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (solicitudes.length === 0) {
        return (
            <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    <EmptyState
                        icon={FileText}
                        title="Sin solicitudes"
                        description={
                            searchTerm || statusFilter !== 'all'
                                ? 'No se encontraron solicitudes con esos filtros'
                                : 'Crea tu primera solicitud de cotización para comenzar'
                        }
                        actionLabel={
                            !searchTerm && statusFilter === 'all'
                                ? 'Nueva Solicitud'
                                : undefined
                        }
                        onAction={
                            !searchTerm && statusFilter === 'all'
                                ? onNewSolicitud
                                : undefined
                        }
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="text-slate-500 font-medium">Producto</TableHead>
                            <TableHead className="text-slate-500 font-medium">Cantidad</TableHead>
                            <TableHead className="text-slate-500 font-medium">Estado</TableHead>
                            <TableHead className="text-slate-500 font-medium">Fecha Finalización</TableHead>
                            <TableHead className="text-slate-500 font-medium text-center">Ofertas</TableHead>
                            <TableHead className="text-slate-500 font-medium text-right">Mejor Precio</TableHead>
                            <TableHead className="text-slate-500 font-medium text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {solicitudes.map((sol) => {
                            const solOfertas = getOfertasBySolicitud(sol.id);
                            const mejorPrecio =
                                solOfertas.length > 0
                                    ? Math.min(...solOfertas.map((o) => o.precio_unitario))
                                    : null;
                            const isExpanded = expandedRow === sol.id;

                            return (
                                <React.Fragment key={sol.id}>
                                    <TableRow
                                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50' : ''}`}
                                        onClick={() => onExpandRow(isExpanded ? null : sol.id)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {isExpanded ? (
                                                    <ChevronUp className="w-4 h-4 text-slate-400" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-[#1E293B]">
                                                        {sol.producto_servicio}
                                                    </p>
                                                    {sol.categoria && (
                                                        <Badge variant="secondary" className="text-xs mt-1">
                                                            {sol.categoria}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {sol.cantidad} {sol.unidad_medida}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={sol.estado} />
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {sol.fecha_vencimiento
                                                ? format(new Date(sol.fecha_vencimiento), 'd MMM yyyy', {
                                                    locale: es,
                                                })
                                                : format(
                                                    new Date(sol.created_date).setDate(
                                                        new Date(sol.created_date).getDate() + 30,
                                                    ),
                                                    'd MMM yyyy',
                                                    { locale: es },
                                                )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#D2FC31]/20 text-sm font-semibold text-[#1E293B]">
                                                {solOfertas.length}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-[#1E293B]">
                                            {mejorPrecio ? `$${mejorPrecio.toLocaleString()}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div
                                                className="flex items-center justify-end gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button variant="ghost" size="icon" title="Ver más">
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onTogglePause(sol)}
                                                    disabled={
                                                        sol.estado === 'Concretada' || sol.estado === 'Vencida'
                                                    }
                                                    title={sol.estado === 'Pausada' ? 'Reanudar' : 'Pausar'}
                                                >
                                                    {sol.estado === 'Pausada' ? (
                                                        <Play className="w-4 h-4 text-emerald-600" />
                                                    ) : (
                                                        <Pause className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* Expanded Offers */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="p-0 border-0">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="bg-slate-50 p-6 border-y border-slate-100">
                                                            <h4 className="font-semibold text-[#1E293B] mb-4">
                                                                Ofertas Recibidas ({solOfertas.length})
                                                            </h4>
                                                            {solOfertas.length === 0 ? (
                                                                <p className="text-slate-500 text-sm">
                                                                    Aún no has recibido ofertas para esta solicitud
                                                                </p>
                                                            ) : (
                                                                <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow className="hover:bg-transparent">
                                                                                <TableHead className="text-slate-500 font-medium">Proveedor</TableHead>
                                                                                <TableHead className="text-slate-500 font-medium">Condiciones</TableHead>
                                                                                <TableHead className="text-slate-500 font-medium">Precio Unit.</TableHead>
                                                                                <TableHead className="text-slate-500 font-medium">Cantidad</TableHead>
                                                                                <TableHead className="text-slate-500 font-medium">Entrega</TableHead>
                                                                                <TableHead className="text-slate-500 font-medium text-right">Acciones</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {solOfertas.map((oferta) => (
                                                                                <TableRow
                                                                                    key={oferta.id}
                                                                                    className="hover:bg-slate-50/50"
                                                                                >
                                                                                    <TableCell>
                                                                                        <div className="flex items-center gap-3">
                                                                                            <div className="w-10 h-10 rounded-full bg-[#D2FC31] flex items-center justify-center text-sm font-medium text-[#1E293B]">
                                                                                                {oferta.proveedor_nombre?.[0] || 'P'}
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="font-medium text-[#1E293B]">
                                                                                                    {oferta.proveedor_nombre || 'Proveedor'}
                                                                                                </p>
                                                                                                <RatingStars
                                                                                                    rating={oferta.proveedor_calificacion || 0}
                                                                                                    size="sm"
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell className="text-slate-600">
                                                                                        {oferta.condiciones_pago}
                                                                                    </TableCell>
                                                                                    <TableCell className="font-semibold text-[#1E293B]">
                                                                                        ${oferta.precio_unitario?.toLocaleString()}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-slate-600">
                                                                                        {oferta.cantidad}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-slate-600">
                                                                                        {oferta.tiempo_entrega}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right">
                                                                                        <div className="flex items-center justify-end gap-2">
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                size="sm"
                                                                                                onClick={async () => {
                                                                                                    try {
                                                                                                        let conv = await base44.entities.Conversacion.filter({
                                                                                                            participante_1_id: user?.email,
                                                                                                            participante_2_id: oferta.proveedor_id,
                                                                                                        });
                                                                                                        if (!conv || conv.length === 0) {
                                                                                                            conv = await base44.entities.Conversacion.filter({
                                                                                                                participante_1_id: oferta.proveedor_id,
                                                                                                                participante_2_id: user?.email,
                                                                                                            });
                                                                                                        }
                                                                                                        if (!conv || conv.length === 0) {
                                                                                                            await base44.entities.Conversacion.create({
                                                                                                                participante_1_id: user?.email,
                                                                                                                participante_2_id: oferta.proveedor_id,
                                                                                                                participante_1_nombre:
                                                                                                                    myCompany?.nombre_comercial || user?.full_name,
                                                                                                                participante_2_nombre: oferta.proveedor_nombre,
                                                                                                                ultimo_mensaje: '',
                                                                                                                fecha_ultimo_mensaje: new Date().toISOString(),
                                                                                                            });
                                                                                                        }
                                                                                                        window.location.href = createPageUrl('Chat');
                                                                                                    } catch (error) {
                                                                                                        toast.error('Error al abrir chat: ' + error.message);
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <MessageSquare className="w-4 h-4 mr-1" />
                                                                                                Negociar
                                                                                            </Button>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
                                                                                            >
                                                                                                <Check className="w-4 h-4 mr-1" />
                                                                                                Aceptar
                                                                                            </Button>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
