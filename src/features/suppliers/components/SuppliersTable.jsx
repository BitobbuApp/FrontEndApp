import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Store, Eye, MessageSquare, BadgeCheck, Globe, Package } from 'lucide-react';
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
import RatingStars from '@/components/ui/RatingStars';
import EmptyState from '@/components/ui/EmptyState';

export default function SuppliersTable({
    filteredProveedores,
    isLoading,
    searchTerm,
    sectorFilter,
    handleViewProfile,
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

    if (filteredProveedores.length === 0) {
        return (
            <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    <EmptyState
                        icon={Store}
                        title="Sin proveedores"
                        description={
                            searchTerm || sectorFilter !== 'Todos'
                                ? 'No se encontraron proveedores con esos criterios'
                                : 'Los proveedores aparecerán aquí'
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
                            <TableHead className="text-slate-500 font-medium">Proveedor</TableHead>
                            <TableHead className="text-slate-500 font-medium">Sector</TableHead>
                            <TableHead className="text-slate-500 font-medium">Tipo</TableHead>
                            <TableHead className="text-slate-500 font-medium">Ubicación</TableHead>
                            <TableHead className="text-slate-500 font-medium">Rating</TableHead>
                            <TableHead className="text-slate-500 font-medium text-center">
                                Transacciones
                            </TableHead>
                            <TableHead className="text-slate-500 font-medium text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProveedores.map((prov) => (
                            <TableRow key={prov.id} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {prov.logo_url ? (
                                                <img
                                                    src={prov.logo_url}
                                                    alt={prov.nombre_comercial}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-lg font-bold text-[#1E293B]">
                                                    {prov.nombre_comercial?.[0] || 'P'}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-[#1E293B]">
                                                    {prov.nombre_comercial}
                                                </p>
                                                {prov.plan_suscripcion === 'Premium' && (
                                                    <BadgeCheck className="w-4 h-4 text-[#D2FC31]" />
                                                )}
                                                {prov.badge_fundador && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Fundador
                                                    </Badge>
                                                )}
                                            </div>
                                            {prov.cobertura_nacional && (
                                                <div className="flex items-center gap-1 text-emerald-600 text-xs mt-0.5">
                                                    <Globe className="w-3 h-3" />
                                                    <span>Nacional</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="text-xs">
                                        {prov.sector}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    {prov.tipo_empresa || 'Empresa'}
                                </TableCell>
                                <TableCell className="text-slate-600 text-sm">
                                    {[prov.ubicacion_ciudad, prov.ubicacion_estado]
                                        .filter(Boolean)
                                        .join(', ') || '-'}
                                </TableCell>
                                <TableCell>
                                    <RatingStars rating={prov.calificacion_promedio || 0} size="sm" />
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                                        {prov.numero_transacciones || 0}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            to={
                                                createPageUrl('Marketplace') +
                                                `?proveedor=${prov.created_by}`
                                            }
                                        >
                                            <Button variant="outline" size="sm">
                                                <Package className="w-4 h-4 mr-1" />
                                                Catálogo
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewProfile(prov)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Perfil
                                        </Button>
                                        <Link
                                            to={createPageUrl('Chat') + `?proveedor=${prov.created_by}`}
                                        >
                                            <Button
                                                size="sm"
                                                className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
                                            >
                                                <MessageSquare className="w-4 h-4 mr-1" />
                                                Chat
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
