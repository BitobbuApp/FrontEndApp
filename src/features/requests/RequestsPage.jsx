import React, { useState } from 'react';
import useRequestsData from './hooks/useRequestsData';
import RequestsHeader from './components/RequestsHeader';
import RequestsTable from './components/RequestsTable';
import RequestDetailModal from './components/RequestDetailModal';
import { useNavigate } from 'react-router-dom';

export default function RequestsPage() {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [viewMode, setViewMode] = useState('list');

    const {
        requests,
        isLoading,
        page,
        setPage,
        totalPages,
        handleTogglePause,
        handleDelete,
    } = useRequestsData();

    // Client-side filtering (status on top of server-side pagination)
    const filteredRequests = requests.filter((req) => {
        return statusFilter === 'all' || req.status === statusFilter;
    });

    return (
        <div className="space-y-6">
            <RequestsHeader
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onNewSolicitud={() => navigate('/Requests/new')}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
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
                statusFilter={statusFilter}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                viewMode={viewMode}
            />

            <RequestDetailModal
                open={!!selectedRequestId}
                onOpenChange={(open) => { if (!open) setSelectedRequestId(null); }}
                requestId={selectedRequestId}
            />
        </div>
    );
}
