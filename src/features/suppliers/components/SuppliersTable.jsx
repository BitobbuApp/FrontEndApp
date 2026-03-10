import React from 'react';
import { Store, Eye, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
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
                        {filteredProveedores.map((company) => {
                            const mainLocation = company.locations?.[0] || {};

                            return (
                                <TableRow key={company.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {company.logo_url ? (
                                                    <img
                                                        src={company.logo_url}
                                                        alt={company.trade_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-lg font-bold text-[#1E293B]">
                                                        {company.trade_name?.[0] || 'P'}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#1E293B]">
                                                    {company.trade_name}
                                                </p>
                                                {mainLocation.national_coverage && (
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
                                            {company.sector || '-'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {company.company_type || 'Empresa'}
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-sm">
                                        {[mainLocation.location_city, mainLocation.location_state]
                                            .filter(Boolean)
                                            .join(', ') || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <RatingStars rating={company.average_rating || 0} size="sm" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                                            {company.transaction_count || 0}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewProfile(company)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Perfil
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">
                    {filteredProveedores.length} proveedor{filteredProveedores.length !== 1 ? 'es' : ''}
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
