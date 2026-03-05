import React, { useState } from 'react';
import useRequestsData from './hooks/useRequestsData';
import RequestsHeader from './components/RequestsHeader';
import RequestsTable from './components/RequestsTable';
import SolicitudModal from '@/components/solicitud/SolicitudModal';

export default function RequestsPage() {
    const [solicitudModalOpen, setSolicitudModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedRow, setExpandedRow] = useState(null);

    const {
        user,
        myCompany,
        solicitudes,
        isLoading,
        getOfertasBySolicitud,
        handleTogglePause,
    } = useRequestsData();

    const filteredSolicitudes = solicitudes.filter((sol) => {
        const matchesSearch = sol.producto_servicio
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || sol.estado === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <RequestsHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onNewSolicitud={() => setSolicitudModalOpen(true)}
            />

            <RequestsTable
                solicitudes={filteredSolicitudes}
                isLoading={isLoading}
                expandedRow={expandedRow}
                onExpandRow={setExpandedRow}
                getOfertasBySolicitud={getOfertasBySolicitud}
                onTogglePause={handleTogglePause}
                onNewSolicitud={() => setSolicitudModalOpen(true)}
                user={user}
                myCompany={myCompany}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
            />

            <SolicitudModal
                open={solicitudModalOpen}
                onOpenChange={setSolicitudModalOpen}
            />
        </div>
    );
}
