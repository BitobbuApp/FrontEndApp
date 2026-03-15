import React, { useState } from 'react';
import useRequestsData from './hooks/useRequestsData';
import RequestsHeader from './components/RequestsHeader';
import RequestsTable from './components/RequestsTable';
import RequestDetailModal from './components/RequestDetailModal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function RequestsPage() {
    const navigate = useNavigate();
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
                onNewSolicitud={() => navigate('/Requests/new')}
            />

            <RequestsTable
                requests={filteredRequests}
                isLoading={isLoading}
                expandedRow={expandedRow}
                onExpandRow={setExpandedRow}
                onTogglePause={handleTogglePause}
                onDelete={handleDelete}
                onViewDetail={(id) => setSelectedRequestId(id)}
                onNewSolicitud={() => navigate('/Requests/new')}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            <RequestDetailModal
                open={!!selectedRequestId}
                onOpenChange={(open) => { if (!open) setSelectedRequestId(null); }}
                requestId={selectedRequestId}
            />
        </div>
    );
}
