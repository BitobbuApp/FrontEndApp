import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/EmptyState';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useMarketplaceData } from './hooks/useMarketplaceData';
import MarketplaceFilters from './components/MarketplaceFilters';
import ProductGrid from './components/ProductGrid';
import ProductTable from './components/ProductTable';
import HeroSection from './components/HeroSection';
import MarketplaceCTA from './components/MarketplaceCTA';
import MarketplaceLaunchState from './components/MarketplaceLaunchState';
import { useAuth } from '@/features/auth/AuthContext';

const INITIAL_FILTERS = {
    searchTerm: '',
    categoryId: '',
    subcategoryId: '',
    countryId: '',
    stateId: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    page: 1,
    limit: 12
};

export default function MarketplacePage() {
    // Header search sends the term as /?q=...
    const [searchParams] = useSearchParams();
    const queryTerm = searchParams.get('q') || '';
    const [filters, setFilters] = useState({ ...INITIAL_FILTERS, searchTerm: queryTerm });
    useEffect(() => {
        setFilters((prev) => (prev.searchTerm === queryTerm ? prev : { ...prev, searchTerm: queryTerm, page: 1 }));
    }, [queryTerm]);
    const hasActiveFilters = Boolean(
        filters.searchTerm || filters.categoryId || filters.subcategoryId ||
        filters.countryId || filters.stateId || filters.minPrice || filters.maxPrice
    );

    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();
    const { productos, total, priceRange, isLoading } = useMarketplaceData(filters);
    const handleViewDetail = (product) => {
        navigate(`/Marketplace/producto/${product.id}`);
    };

    const { isAuthenticated } = useAuth();
    const totalPages = Math.ceil(total / filters.limit) || 1;
    const isCatalogEmpty = !isLoading && productos.length === 0 && !hasActiveFilters;

    // Categories panel of the hero: filter the products and scroll to them
    const scrollToProducts = () => document.getElementById('productos-section')?.scrollIntoView({ behavior: 'smooth' });
    const handleSelectCategory = (categoryId) => {
        setFilters((prev) => ({ ...prev, categoryId, subcategoryId: '', page: 1 }));
        scrollToProducts();
    };
    const handleSelectSubcategory = (subcategoryId, categoryId) => {
        setFilters((prev) => ({ ...prev, categoryId, subcategoryId, page: 1 }));
        scrollToProducts();
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            {!isAuthenticated && (
                <HeroSection
                    selectedCategoryId={filters.categoryId}
                    selectedSubcategoryId={filters.subcategoryId}
                    onSelectCategory={handleSelectCategory}
                    onSelectSubcategory={handleSelectSubcategory}
                />
            )}

            {/* Section Header */}
            <div id="productos-section" className={`pt-4 scroll-mt-24 ${!isAuthenticated ? 'mt-8' : ''}`}>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0B2046]">
                    Explora Productos
                </h2>
                <p className="text-slate-500 mt-1">
                    Encuentra insumos y materiales al por mayor.
                </p>
            </div>

            {/* Filters */}
            {!isCatalogEmpty && (
                <MarketplaceFilters
                    filters={filters}
                    setFilters={setFilters}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    priceRange={priceRange}
                />
            )}

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
            ) : isCatalogEmpty ? (
                <MarketplaceLaunchState />
            ) : productos.length === 0 ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <EmptyState
                            icon={ShoppingBag}
                            title="Sin productos"
                            description="No se encontraron productos con esos criterios"
                            actionLabel="Limpiar filtros"
                            onAction={() => setFilters(INITIAL_FILTERS)}
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
                        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between mt-6">
                            <p className="text-sm text-slate-500 text-center sm:text-left">
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

            {/* CTA Section for guests */}
            {!isAuthenticated && !isCatalogEmpty && <MarketplaceCTA />}
        </div>
    );
}
