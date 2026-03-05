import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, MessageSquare, Package, Clock, Users } from 'lucide-react';
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

export default function ProspectsTable({
    filteredSolicitudes,
    isLoading,
    searchTerm,
    categoryFilter,
    handleViewDetail,
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
        <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="text-slate-500 font-medium">
                                Producto/Servicio
                            </TableHead>
                            <TableHead className="text-slate-500 font-medium">Cantidad</TableHead>
                            <TableHead className="text-slate-500 font-medium">Categoría</TableHead>
                            <TableHead className="text-slate-500 font-medium">Estado</TableHead>
                            <TableHead className="text-slate-500 font-medium">Fecha</TableHead>
                            <TableHead className="text-slate-500 font-medium">Fecha Límite</TableHead>
                            <TableHead className="text-slate-500 font-medium text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSolicitudes.map((sol) => (
                            <TableRow key={sol.id} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <p className="font-semibold text-[#1E293B]">
                                        {sol.producto_servicio}
                                    </p>
                                    {sol.descripcion && (
                                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                                            {sol.descripcion}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-slate-400" />
                                        {sol.cantidad} {sol.unidad_medida}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {sol.categoria ? (
                                        <Badge variant="secondary" className="text-xs">
                                            {sol.categoria}
                                        </Badge>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={sol.estado} />
                                </TableCell>
                                <TableCell className="text-slate-600 text-sm">
                                    {format(new Date(sol.created_date), 'd MMM yyyy', { locale: es })}
                                </TableCell>
                                <TableCell>
                                    {sol.fecha_vencimiento ? (
                                        <div className="flex items-center gap-1 text-amber-600 text-sm">
                                            <Clock className="w-4 h-4" />
                                            {format(new Date(sol.fecha_vencimiento), 'd MMM', {
                                                locale: es,
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewDetail(sol)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Ver
                                        </Button>
                                        <Link to={createPageUrl('Chat') + `?cliente=${sol.created_by}`}>
                                            <Button
                                                size="sm"
                                                className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
                                            >
                                                <MessageSquare className="w-4 h-4 mr-1" />
                                                Negociar
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
