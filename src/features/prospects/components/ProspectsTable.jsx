import React from 'react';
import { cn } from '@/lib/utils';
import ProspectMobileCard from './ProspectMobileCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Clock, Users, Star, Zap } from 'lucide-react';
import Pagination from '@/components/atoms/Pagination';
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
import DirectRequestBadge from '@/features/requests/components/DirectRequestBadge';
import EmptyState from '@/components/ui/EmptyState';
import { formatCategory } from '@/features/appMetadata/utils/subcategoryGroups';
import { getDeadlineInfo, DEADLINE_TONE_CLASSES } from '../utils/deadline';

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
    hasFilters = false,
    handleViewDetail,
    handleQuickQuote,
    page,
    totalPages,
    onPageChange,
    viewMode = 'list',
}) {
    if (isLoading) {
        return (
            <Card className="rounded-3xl border border-border shadow-sm overflow-hidden">
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
            <Card className="rounded-3xl border border-border shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    <EmptyState
                        icon={Users}
                        title="Sin leads disponibles"
                        description={
                            hasFilters
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
            {/* ── Grid/Mobile view ── */}
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-1 gap-4 sm:hidden"}>
                {filteredSolicitudes.map((req) => (
                    <ProspectMobileCard
                        key={req.id}
                        req={req}
                        onViewDetail={handleViewDetail}
                        onQuickQuote={handleQuickQuote}
                    />
                ))}
            </div>

            {/* Mobile/Grid pagination */}
            <div className={viewMode === 'grid' ? "block mt-2" : "sm:hidden"}>
                <Pagination
                    totalItems={filteredSolicitudes.length}
                    itemsLabel="solicitud"
                    itemsLabelPlural="solicitudes"
                    currentPage={page || 1}
                    totalPages={totalPages || 1}
                    onPageChange={onPageChange}
                    className="border-t-0 px-1 py-0"
                />
            </div>

            {/* ── Desktop table (hidden on mobile, and hidden if viewMode === grid) ── */}
            <Card className={viewMode === 'grid' ? "hidden" : "hidden sm:block rounded-3xl border border-border shadow-sm overflow-hidden"}>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-[#0B2046]">Producto / servicio</TableHead>
                            <TableHead className="font-semibold text-[#0B2046]">Empresa</TableHead>
                            <TableHead className="font-semibold text-[#0B2046]">Cantidad</TableHead>
                            <TableHead className="font-semibold text-[#0B2046]">Categoría</TableHead>
                            <TableHead className="font-semibold text-[#0B2046]">Publicada</TableHead>
                            <TableHead className="font-semibold text-[#0B2046]">Fecha límite</TableHead>
                            <TableHead className="text-right font-semibold text-[#0B2046]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSolicitudes.map((req) => {
                            const deadline = getDeadlineInfo(req.expiration_date);
                            return (
                            <TableRow key={req.id} className="hover:bg-muted/50">
                                <TableCell>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-[#0B2046]">
                                            {req.product_service}
                                        </p>
                                        <DirectRequestBadge request={req} perspective="supplier" />
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "rounded-full border-0 px-2 py-0 h-5 text-[11px] font-semibold",
                                                req.type === 'service'
                                                    ? "bg-purple-50 text-purple-600"
                                                    : "bg-blue-50 text-blue-600"
                                            )}
                                        >
                                            {req.type === 'service' ? 'Servicio' : 'Producto'}
                                        </Badge>
                                    </div>
                                    {req.description && (
                                        <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                                            {req.description.length > 30
                                                ? req.description.substring(0, 30) + '...'
                                                : req.description}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {req.company?.logo_url ? (
                                                <img
                                                    src={req.company.logo_url}
                                                    alt={req.company.trade_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-[#0B2046]">
                                                    {req.company?.trade_name?.[0] || 'E'}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#0B2046]">
                                                {req.company?.trade_name || 'Empresa'}
                                            </p>
                                            {req.company?.average_rating > 0 && (
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    {req.company.average_rating.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600 whitespace-nowrap">
                                    {req.quantity} {unitLabels[req.unit_of_measure] || req.unit_of_measure}
                                </TableCell>
                                <TableCell>
                                    {req.category ? (
                                        <span className="inline-block max-w-[180px] rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium leading-snug text-slate-700">
                                            {formatCategory(req.category, req.subcategory)}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-slate-600 whitespace-nowrap">
                                    {format(new Date(req.created_at), 'd MMM yyyy', { locale: es })}
                                </TableCell>
                                <TableCell>
                                    {deadline ? (
                                        <div className="space-y-1">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium",
                                                DEADLINE_TONE_CLASSES[deadline.tone]
                                            )}>
                                                <Clock className="w-4 h-4" />
                                                {deadline.label}
                                            </span>
                                            <p className="pl-1 text-sm text-slate-400">{deadline.dateLabel}</p>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg text-slate-500"
                                            title="Ver solicitud"
                                            onClick={() => handleViewDetail(req)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        {req.has_responded ? (
                                            <Button
                                                variant="ghost"
                                                className="h-8 gap-1.5 rounded-lg bg-green-50/50 text-xs text-green-600 cursor-default hover:bg-green-50/50"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                Oferta enviada
                                            </Button>
                                        ) : (
                                            <Button
                                                className="h-8 gap-1.5 rounded-lg bg-[#D2FC31] text-xs font-bold text-slate-900 hover:bg-[#c4ed2d]"
                                                onClick={() => handleQuickQuote(req)}
                                            >
                                                <Zap className="w-3.5 h-3.5" />
                                                Cotizar
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <Pagination
                totalItems={filteredSolicitudes.length}
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
