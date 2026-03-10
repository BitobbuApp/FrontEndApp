import React, { useState } from 'react';
import { useSuppliersData } from './hooks/useSuppliersData';
import SuppliersFilters from './components/SuppliersFilters';
import SuppliersTable from './components/SuppliersTable';
import SupplierProfileModal from './components/SupplierProfileModal';

export default function SuppliersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sectorFilter, setSectorFilter] = useState('Todos');
    const [ratingFilter, setRatingFilter] = useState('Todos');

    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [selectedProveedor, setSelectedProveedor] = useState(null);

    const { filteredProveedores, isLoading, page, setPage, totalPages } = useSuppliersData(
        searchTerm,
        sectorFilter,
        ratingFilter
    );

    const handleViewProfile = (company) => {
        setSelectedProveedor(company);
        setProfileModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
                    Directorio de Proveedores
                </h1>
                <p className="text-slate-500 mt-1">
                    Encuentra proveedores confiables para tu negocio
                </p>
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

            {/* Providers Table */}
            <SuppliersTable
                filteredProveedores={filteredProveedores}
                isLoading={isLoading}
                searchTerm={searchTerm}
                sectorFilter={sectorFilter}
                handleViewProfile={handleViewProfile}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {/* Profile Modal */}
            <SupplierProfileModal
                open={profileModalOpen}
                onOpenChange={setProfileModalOpen}
                selectedProveedor={selectedProveedor}
            />
        </div>
    );
}
