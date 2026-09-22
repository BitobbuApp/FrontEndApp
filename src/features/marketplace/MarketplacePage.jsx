import React, { useState } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

import { useMarketplaceData } from './hooks/useMarketplaceData';
import MarketplaceFilters from './components/MarketplaceFilters';
import ProductGrid from './components/ProductGrid';
import ProductTable from './components/ProductTable';
import ProductDetailModal from './components/ProductDetailModal';

export default function MarketplacePage() {
    const [filters, setFilters] = useState({
        searchTerm: '',
        categoryId: '',
        countryId: '',
        stateId: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'newest',
        page: 1,
        limit: 12
    });

    const [viewMode, setViewMode] = useState('grid');
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const navigate = useNavigate();

    const { productos, total, isLoading } = useMarketplaceData(filters);

    const handleViewDetail = (product) => {
        setSelectedProduct(product);
        setSelectedImageIndex(0);
        setDetailModalOpen(true);
    };

    const handleRequestQuote = (product) => {
        setSelectedProduct(product);
        setDetailModalOpen(false);
        navigate('/Requests/new', { state: { product: product.name } });
    };

    const totalPages = Math.ceil(total / filters.limit) || 1;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Marketplace Mayorista
                </h1>
                <p className="text-slate-500 mt-1">
                    Explora productos de proveedores verificados
                </p>
            </div>

            {/* Filters */}
            <MarketplaceFilters
                filters={filters}
                setFilters={setFilters}
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
            ) : productos.length === 0 ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <EmptyState
                            icon={ShoppingBag}
                            title="Sin productos"
                            description={
                                filters.searchTerm || filters.categoryId
                                    ? 'No se encontraron productos con esos criterios'
                                    : 'Los productos del marketplace aparecerán aquí'
                            }
                        />
                    </CardContent>
                </Card>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <ProductGrid
                            filteredProducts={productos}
                            handleViewDetail={handleViewDetail}
                        />
                    ) : (
                        <ProductTable
                            filteredProducts={productos}
                            handleViewDetail={handleViewDetail}
                        />
                    )}

                    {/* Pagination */}
                    {total > 0 && (
                        <div className="flex items-center justify-between mt-6">
                            <p className="text-sm text-slate-500">
                                Mostrando {((filters.page - 1) * filters.limit) + 1} a {Math.min(filters.page * filters.limit, total)} de {total} productos
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={filters.page === 1}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </Button>
                                <div className="flex items-center px-4 text-sm font-medium">
                                    Página {filters.page} de {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={filters.page >= totalPages}
                                >
                                    Siguiente
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
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
        </div>
    );
}
