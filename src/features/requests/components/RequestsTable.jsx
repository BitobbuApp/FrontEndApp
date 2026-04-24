import React from 'react';
import RequestRowExpanded from './RequestRowExpanded';
import RequestMobileCard from './RequestMobileCard';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Eye,
    Pause,
    Play,
    ChevronDown,
    ChevronUp,
    Trash2,
    FileText,
} from 'lucide-react';
import Pagination from '@/components/atoms/Pagination';
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
    viewMode = 'list',
}) {
    const navigate = useNavigate();
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
        <div className="space-y-4">
            {/* ── Grid/Mobile view ── */}
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-1 gap-4 sm:hidden"}>
                {requests.map((req) => (
                    <RequestMobileCard
                        key={req.id}
                        req={req}
                        onTogglePause={onTogglePause}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Mobile/Grid pagination */}
            <div className={viewMode === 'grid' ? "block mt-2" : "sm:hidden"}>
                <Pagination
                    totalItems={requests.length}
                    itemsLabel="solicitud"
                    itemsLabelPlural="solicitudes"
                    currentPage={page || 1}
                    totalPages={totalPages || 1}
                    onPageChange={onPageChange}
                    className="border-t-0 px-1 py-0"
                />
            </div>

            {/* ── Desktop table (hidden on mobile, and hidden if viewMode === grid) ── */}
            <Card className={viewMode === 'grid' ? "hidden" : "hidden sm:block border-0 shadow-sm overflow-hidden"}>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="text-slate-500 font-medium">Producto</TableHead>
                            <TableHead className="text-slate-500 font-medium">Cantidad</TableHead>
                            <TableHead className="text-slate-500 font-medium">Estado</TableHead>
                            <TableHead className="text-slate-500 font-medium">Fecha Límite</TableHead>
                            <TableHead className="text-slate-500 font-medium text-center">Ofertas</TableHead>
                            <TableHead className="text-slate-500 font-medium">Mejor Oferta</TableHead>
                            <TableHead className="text-slate-500 font-medium text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => {
                            const isExpanded = expandedRow === req.id;

                            return (
                                <React.Fragment key={req.id}>
                                    <TableRow
                                        className={`hover:bg-muted/50/50 transition-colors ${req.response_count > 0 ? 'cursor-pointer' : 'cursor-default opacity-80'} ${isExpanded ? 'bg-muted/50' : ''}`}
                                        onClick={() => {
                                            if (req.response_count > 0) {
                                                onExpandRow(isExpanded ? null : req.id);
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {isExpanded ? (
                                                    <ChevronUp className="w-4 h-4 text-slate-400" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-foreground">
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
                                            <Badge variant="outline" className="bg-[#D2FC31]/20 text-slate-900 border-[#D2FC31]/40 font-semibold">
                                                {req.response_count || 0} {req.response_count === 1 ? 'oferta' : 'ofertas'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-emerald-600 font-semibold">
                                            {req.best_offer_amount
                                                ? `$${Number(req.best_offer_amount).toLocaleString()}`
                                                : <span className="text-slate-400 font-normal text-sm">—</span>
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div
                                                className="flex items-center justify-end gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    title="Ver detalle completo"
                                                    className="text-xs h-8 gap-1"
                                                    onClick={() => navigate(`/Requests/${req.id}/summary`)}
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
                                                <TableCell colSpan={7} className="p-0 border-0">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <RequestRowExpanded request={req} />
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
            <Pagination
                totalItems={requests.length}
                itemsLabel="solicitud"
                itemsLabelPlural="solicitudes"
                currentPage={page || 1}
                totalPages={totalPages || 1}
                onPageChange={onPageChange}
            />
        </Card>
        </div>
    );
}
