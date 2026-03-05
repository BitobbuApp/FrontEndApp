import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import EmptyState from '@/components/ui/EmptyState';
import SolicitudModal from '@/components/solicitud/SolicitudModal';

import { useMarketplaceData } from './hooks/useMarketplaceData';
import MarketplaceFilters from './components/MarketplaceFilters';
import ProductGrid from './components/ProductGrid';
import ProductTable from './components/ProductTable';
import ProductDetailModal from './components/ProductDetailModal';

export default function MarketplacePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');
    const [typeFilter, setTypeFilter] = useState('Todos');
    const [viewMode, setViewMode] = useState('grid');

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [solicitudModalOpen, setSolicitudModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const { filteredProducts, isLoading } = useMarketplaceData(
        searchTerm,
        categoryFilter,
        typeFilter
    );

    const handleViewDetail = (product) => {
        setSelectedProduct(product);
        setSelectedImageIndex(0);
        setDetailModalOpen(true);
    };

    const handleRequestQuote = (product) => {
        setSelectedProduct(product);
        setDetailModalOpen(false);
        setSolicitudModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
                    Marketplace Mayorista
                </h1>
                <p className="text-slate-500 mt-1">
                    Explora productos de proveedores verificados
                </p>
            </div>

            {/* Filters */}
            <MarketplaceFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* Products */}
            {isLoading ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : filteredProducts.length === 0 ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <EmptyState
                            icon={ShoppingBag}
                            title="Sin productos"
                            description={
                                searchTerm || categoryFilter !== 'Todas'
                                    ? 'No se encontraron productos con esos criterios'
                                    : 'Los productos del marketplace aparecerán aquí'
                            }
                        />
                    </CardContent>
                </Card>
            ) : viewMode === 'grid' ? (
                <ProductGrid
                    filteredProducts={filteredProducts}
                    handleViewDetail={handleViewDetail}
                />
            ) : (
                <ProductTable
                    filteredProducts={filteredProducts}
                    handleViewDetail={handleViewDetail}
                />
            )}

            {/* Detail Modal */}
            <ProductDetailModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
                selectedProduct={selectedProduct}
                selectedImageIndex={selectedImageIndex}
                setSelectedImageIndex={setSelectedImageIndex}
                handleRequestQuote={handleRequestQuote}
            />

            {/* Quote Request Modal */}
            <SolicitudModal
                open={solicitudModalOpen}
                onOpenChange={setSolicitudModalOpen}
            />
        </div>
    );
}
