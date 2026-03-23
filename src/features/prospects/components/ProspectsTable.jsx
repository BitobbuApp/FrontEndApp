import React from 'react';
import ProspectMobileCard from './ProspectMobileCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Package, Clock, Users, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';

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

export default function ProspectsTable({
    filteredSolicitudes,
    isLoading,
    searchTerm,
    categoryFilter,
    handleViewDetail,
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

    if (filteredSolicitudes.length === 0) {
        return (
            <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    <EmptyState
                        icon={Users}
                        title="Sin leads disponibles"
                        description={
                            searchTerm || categoryFilter !== 'Todas'
                                ? 'No se encontraron solicitudes con esos criterios'
                                : 'Las solicitudes de potenciales clientes aparecerán aquí'
                        }
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* ── Mobile grid (hidden on sm+) ── */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
                {filteredSolicitudes.map((req) => (
                    <ProspectMobileCard
                        key={req.id}
                        req={req}
                        onViewDetail={handleViewDetail}
                    />
                ))}
            </div>

            {/* Mobile pagination */}
            <div className="flex items-center justify-between sm:hidden px-1 py-2">
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
                        Ant.
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        disabled={!totalPages || page >= totalPages}
                    >
                        Sig.
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>

            {/* ── Desktop table (hidden on mobile) ── */}
            <Card className="hidden sm:block border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="text-slate-500 font-medium">
                                Producto/Servicio
                            </TableHead>
                            <TableHead className="text-slate-500 font-medium">Empresa</TableHead>
                            <TableHead className="text-slate-500 font-medium">Cantidad</TableHead>
                            <TableHead className="text-slate-500 font-medium">Categoría</TableHead>
                            <TableHead className="text-slate-500 font-medium">Fecha</TableHead>
                            <TableHead className="text-slate-500 font-medium">Fecha Límite</TableHead>
                            <TableHead className="text-slate-500 font-medium text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSolicitudes.map((req) => (
                            <TableRow key={req.id} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <p className="font-semibold text-[#1E293B]">
                                        {req.product_service}
                                    </p>
                                    {req.description && (
                                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                                            {req.description}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {req.company?.logo_url ? (
                                                <img
                                                    src={req.company.logo_url}
                                                    alt={req.company.trade_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-[#1E293B]">
                                                    {req.company?.trade_name?.[0] || 'E'}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[#1E293B]">
                                                {req.company?.trade_name || 'Empresa'}
                                            </p>
                                            {req.company?.average_rating > 0 && (
                                                <div className="flex items-center gap-1 text-xs text-amber-600">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    {req.company.average_rating.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-slate-400" />
                                        {req.quantity} {unitLabels[req.unit_of_measure] || req.unit_of_measure}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {req.category ? (
                                        <Badge variant="secondary" className="text-xs">
                                            {req.category}
                                        </Badge>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-slate-600 text-sm">
                                    {format(new Date(req.created_at), 'd MMM yyyy', { locale: es })}
                                </TableCell>
                                <TableCell>
                                    {req.expiration_date ? (
                                        <div className="flex items-center gap-1 text-amber-600 text-sm">
                                            <Clock className="w-4 h-4" />
                                            {format(new Date(req.expiration_date), 'd MMM', {
                                                locale: es,
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewDetail(req)}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Ver
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">
                    {filteredSolicitudes.length} solicitud{filteredSolicitudes.length !== 1 ? 'es' : ''}
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
        </div>
    );
}
