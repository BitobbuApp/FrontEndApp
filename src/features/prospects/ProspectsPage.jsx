import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProspectsData, EMPTY_PROSPECT_FILTERS } from './hooks/useProspectsData';
import ProspectsFilters from './components/ProspectsFilters';
import ProspectsTable from './components/ProspectsTable';
import QuoteResponseModal from './components/QuoteResponseModal';
import ViewToggle from '@/components/shared/ViewToggle';

export default function ProspectsPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState(EMPTY_PROSPECT_FILTERS);
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    const [quoteRequest, setQuoteRequest] = useState(null);
    const [viewMode, setViewMode] = useState('list');

    const {
        filteredSolicitudes,
        isLoading,
        page,
        setPage,
        totalPages,
        myCategoryValues,
        hasMySubcategories,
    } = useProspectsData(searchTerm, filters);
    const hasFilters = !!(searchTerm || filters.categoryId || filters.subcategoryId || filters.onlyMine);

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
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        Posibles Clientes
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Encuentra empresas que buscan tus productos o servicios
                    </p>
                </div>
                <span className="hidden sm:block pb-2 border-b-0 mt-2 sm:mt-0">
                    <ViewToggle mode={viewMode} onChange={setViewMode} />
                </span>
            </div>

            {/* Filters */}
            <ProspectsFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filters={filters}
                setFilters={setFilters}
                myCategoryValues={myCategoryValues}
                hasMySubcategories={hasMySubcategories}
            />

            {/* Leads Table */}
            <ProspectsTable
                filteredSolicitudes={filteredSolicitudes}
                isLoading={isLoading}
                hasFilters={hasFilters}
                handleViewDetail={handleViewDetail}
                handleQuickQuote={handleQuoteRequest}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                viewMode={viewMode}
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
