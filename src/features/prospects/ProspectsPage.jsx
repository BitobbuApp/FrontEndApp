import React, { useState } from 'react';
import { useProspectsData } from './hooks/useProspectsData';
import ProspectsFilters from './components/ProspectsFilters';
import ProspectsTable from './components/ProspectsTable';
import ProspectDetailModal from './components/ProspectDetailModal';

export default function ProspectsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);

    const {
        filteredSolicitudes,
        isLoading,
    } = useProspectsData(searchTerm, categoryFilter);

    const handleViewDetail = (sol) => {
        setSelectedSolicitud(sol);
        setDetailModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
                    Posibles Clientes
                </h1>
                <p className="text-slate-500 mt-1">
                    Encuentra empresas que buscan tus productos o servicios
                </p>
            </div>

            {/* Filters */}
            <ProspectsFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
            />

            {/* Leads Table */}
            <ProspectsTable
                filteredSolicitudes={filteredSolicitudes}
                isLoading={isLoading}
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                handleViewDetail={handleViewDetail}
            />

            {/* Detail Modal */}
            <ProspectDetailModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
                selectedSolicitud={selectedSolicitud}
            />
        </div>
    );
}
