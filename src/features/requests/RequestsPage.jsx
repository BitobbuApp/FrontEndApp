import React, { useState } from 'react';
import useRequestsData from './hooks/useRequestsData';
import RequestsHeader from './components/RequestsHeader';
import RequestsTable from './components/RequestsTable';
import SolicitudModal from '@/components/solicitud/SolicitudModal';
import RequestDetailModal from './components/RequestDetailModal';
import { Button } from '@/components/ui/button';

export default function RequestsPage() {
    const [solicitudModalOpen, setSolicitudModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedRequestId, setSelectedRequestId] = useState(null);

    const {
        requests,
        isLoading,
        page,
        setPage,
        totalPages,
        handleTogglePause,
        handleDelete,
    } = useRequestsData();

    // Client-side filtering (search + status on top of server-side pagination)
    const filteredRequests = requests.filter((req) => {
        const matchesSearch = req.product_service
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || req.status === statusFilter;
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
                requests={filteredRequests}
                isLoading={isLoading}
                expandedRow={expandedRow}
                onExpandRow={setExpandedRow}
                onTogglePause={handleTogglePause}
                onDelete={handleDelete}
                onViewDetail={(id) => setSelectedRequestId(id)}
                onNewSolicitud={() => setSolicitudModalOpen(true)}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            <SolicitudModal
                open={solicitudModalOpen}
                onOpenChange={setSolicitudModalOpen}
            />

            <RequestDetailModal
                open={!!selectedRequestId}
                onOpenChange={(open) => { if (!open) setSelectedRequestId(null); }}
                requestId={selectedRequestId}
            />
        </div>
    );
}
