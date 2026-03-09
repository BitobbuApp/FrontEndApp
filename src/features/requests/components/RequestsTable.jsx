import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Eye,
    Pause,
    Play,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Trash2,
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
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';

// Map English unit_of_measure values to Spanish labels
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

export default function RequestsTable({
    requests,
    isLoading,
    expandedRow,
    onExpandRow,
    onTogglePause,
    onDelete,
    onViewDetail,
    onNewSolicitud,
    searchTerm,
    statusFilter,
    page,
    totalPages,
    onPageChange,
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

    if (requests.length === 0) {
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
                            <TableHead className="text-slate-500 font-medium text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => {
                            const isExpanded = expandedRow === req.id;

                            return (
                                <React.Fragment key={req.id}>
                                    <TableRow
                                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50' : ''}`}
                                        onClick={() => onExpandRow(isExpanded ? null : req.id)}
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
                                                        {req.product_service}
                                                    </p>
                                                    {req.category && (
                                                        <Badge variant="secondary" className="text-xs mt-1">
                                                            {req.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {req.quantity} {unitLabels[req.unit_of_measure] || req.unit_of_measure}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={req.status} />
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {req.expiration_date
                                                ? format(new Date(req.expiration_date), 'd MMM yyyy', {
                                                    locale: es,
                                                })
                                                : format(
                                                    new Date(new Date(req.created_at).getTime() + 30 * 24 * 60 * 60 * 1000),
                                                    'd MMM yyyy',
                                                    { locale: es },
                                                )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#D2FC31]/20 text-sm font-semibold text-[#1E293B]">
                                                {req.response_count || 0}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div
                                                className="flex items-center justify-end gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Ver más"
                                                    onClick={() => onViewDetail(req.id)}
                                                >
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onTogglePause(req)}
                                                    disabled={
                                                        req.status === 'Completed' || req.status === 'Expired' || req.status === 'Closed'
                                                    }
                                                    title={req.status === 'Paused' ? 'Reanudar' : 'Pausar'}
                                                >
                                                    {req.status === 'Paused' ? (
                                                        <Play className="w-4 h-4 text-emerald-600" />
                                                    ) : (
                                                        <Pause className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDelete(req.id)}
                                                    title="Eliminar"
                                                    className="hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4 text-slate-400" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* Expanded Detail */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="p-0 border-0">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="bg-slate-50 p-6 border-y border-slate-100">
                                                            <div className="space-y-3">
                                                                {req.description && (
                                                                    <div>
                                                                        <h4 className="font-semibold text-[#1E293B] text-sm mb-1">Descripción</h4>
                                                                        <p className="text-slate-600 text-sm">{req.description}</p>
                                                                    </div>
                                                                )}
                                                                {req.files && req.files.length > 0 && (
                                                                    <div>
                                                                        <h4 className="font-semibold text-[#1E293B] text-sm mb-2">Archivos adjuntos</h4>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {req.files.map((file) => (
                                                                                <a
                                                                                    key={file.id}
                                                                                    href={file.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-slate-200 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                                                                                >
                                                                                    <FileText className="w-4 h-4" />
                                                                                    {file.file_name}
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="text-xs text-slate-400">
                                                                    Creada el {format(new Date(req.created_at), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                                                                </div>
                                                            </div>
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">
                    {requests.length} solicitud{requests.length !== 1 ? 'es' : ''}
                </span>
                <span className="text-sm text-slate-500">
                    Página {page || 1} de {totalPages || 1}
                </span>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={!page || page <= 1}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        disabled={!totalPages || page >= totalPages}
                    >
                        Siguiente
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
