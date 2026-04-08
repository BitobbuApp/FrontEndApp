import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProspectsData } from './hooks/useProspectsData';
import ProspectsFilters from './components/ProspectsFilters';
import ProspectsTable from './components/ProspectsTable';
import QuoteResponseModal from './components/QuoteResponseModal';

export default function ProspectsPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    const [quoteRequest, setQuoteRequest] = useState(null);

    const {
        filteredSolicitudes,
        isLoading,
        page,
        setPage,
        totalPages,
    } = useProspectsData(searchTerm, categoryFilter);

    const handleViewDetail = (req) => {
        navigate(`/prospects/${req.id}`, {
            state: { prospect: req },
        });
    };

    const handleQuoteRequest = (req) => {
        setQuoteRequest(req);
        setQuoteModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
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
                handleQuickQuote={handleQuoteRequest}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {/* Quote Response Modal */}
            <QuoteResponseModal
                open={quoteModalOpen}
                onOpenChange={setQuoteModalOpen}
                request={quoteRequest}
            />
        </div>
    );
}
