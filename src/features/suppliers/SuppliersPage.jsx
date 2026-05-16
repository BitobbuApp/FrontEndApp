import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuppliersData } from './hooks/useSuppliersData';
import SuppliersFilters from './components/SuppliersFilters';
import SuppliersTable from './components/SuppliersTable';
import ViewToggle from '@/components/shared/ViewToggle';

export default function SuppliersPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sectorFilter, setSectorFilter] = useState('Todos');
    const [ratingFilter, setRatingFilter] = useState('Todos');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    const { filteredProveedores, isLoading, page, setPage, totalPages } = useSuppliersData(
        searchTerm,
        sectorFilter,
        ratingFilter
    );

    const handleViewProfile = (company) => {
        navigate(`/Perfil/${company.id}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        Directorio de Proveedores
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Encuentra proveedores confiables para tu negocio
                    </p>
                </div>
                <span className="hidden sm:block">
                    <ViewToggle mode={viewMode} onChange={setViewMode} />
                </span>
            </div>

            {/* Filters */}
            <SuppliersFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sectorFilter={sectorFilter}
                setSectorFilter={setSectorFilter}
                ratingFilter={ratingFilter}
                setRatingFilter={setRatingFilter}
            />

            {/* Suppliers list — grid or list */}
            <SuppliersTable
                filteredProveedores={filteredProveedores}
                isLoading={isLoading}
                searchTerm={searchTerm}
                sectorFilter={sectorFilter}
                handleViewProfile={handleViewProfile}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                viewMode={viewMode}
            />
        </div>
    );
}
