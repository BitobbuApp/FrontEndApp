import React from 'react';
import { Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EmptyState from '@/components/ui/EmptyState';
import SupplierCard from './SupplierCard';
import SupplierRow from './SupplierRow';

/**
 * Renders the supplier list in either 'grid' or 'list' view mode.
 * Pagination is rendered in both modes.
 */
export default function SuppliersTable({
    filteredProveedores,
    isLoading,
    searchTerm,
    sectorFilter,
    handleViewProfile,
    page,
    totalPages,
    onPageChange,
    viewMode = 'grid',
}) {
    // ── Loading skeleton ──
    if (isLoading) {
        return viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
                ))}
            </div>
        ) : (
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    // ── Empty state ──
    if (filteredProveedores.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
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

    // ── Pagination footer (shared) ──
    const Pagination = () => (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 mt-2">
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
    );

    // ── Grid view ──
    if (viewMode === 'grid') {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProveedores.map((company) => (
                        <SupplierCard
                            key={company.id}
                            company={company}
                            onViewProfile={handleViewProfile}
                        />
                    ))}
                </div>
                <Pagination />
            </div>
        );
    }

    // ── List view (sm+ only — mobile always sees grid) ──
    return (
        <div className="space-y-4">
            {/* Mobile always shows grid */}
            <div className="grid grid-cols-1 sm:hidden gap-4">
                {filteredProveedores.map((company) => (
                    <SupplierCard
                        key={company.id}
                        company={company}
                        onViewProfile={handleViewProfile}
                    />
                ))}
            </div>

            {/* Desktop shows the selected list view */}
            <Card className="hidden sm:block border-0 shadow-sm overflow-hidden">
                {filteredProveedores.map((company) => (
                    <SupplierRow
                        key={company.id}
                        company={company}
                        onViewProfile={handleViewProfile}
                    />
                ))}
            </Card>

            <Pagination />
        </div>
    );
}
