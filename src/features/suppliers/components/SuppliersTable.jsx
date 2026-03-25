import React from 'react';
import { Store } from 'lucide-react';
import Pagination from '@/components/atoms/Pagination';
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
                <Pagination
                    totalItems={filteredProveedores.length}
                    itemsLabel="proveedor"
                    itemsLabelPlural="proveedores"
                    currentPage={page || 1}
                    totalPages={totalPages || 1}
                    onPageChange={onPageChange}
                    className="mt-2"
                />
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

            <Pagination
                totalItems={filteredProveedores.length}
                itemsLabel="proveedor"
                itemsLabelPlural="proveedores"
                currentPage={page || 1}
                totalPages={totalPages || 1}
                onPageChange={onPageChange}
            />
        </div>
    );
}
