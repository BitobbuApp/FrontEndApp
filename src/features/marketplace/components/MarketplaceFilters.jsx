import React from 'react';
import { Search, Grid3x3, List, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';

export default function MarketplaceFilters({
    filters,
    setFilters,
    viewMode,
    setViewMode,
}) {
    const {
        categories,
        countries,
        states,
    } = useAppMetadata();

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === 'Todos' ? '' : value,
            page: 1 // Reset page when filters change
        }));
    };

    // Filter states based on selected country
    const availableStates = states.filter(
        state => !filters.countryId || state.country_id === Number(filters.countryId)
    );

    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Buscar productos o proveedores..."
                            value={filters.searchTerm}
                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Tabs value={viewMode} onValueChange={setViewMode}>
                            <TabsList className="h-11">
                                <TabsTrigger value="grid" className="h-9">
                                    <Grid3x3 className="w-4 h-4" />
                                </TabsTrigger>
                                <TabsTrigger value="table" className="h-9">
                                    <List className="w-4 h-4" />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Category Filter */}
                    <Select
                        value={filters.categoryId || 'Todos'}
                        onValueChange={(val) => handleFilterChange('categoryId', val)}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todas las Categorías</SelectItem>
                            {categories?.map((cat) => (
                                <SelectItem key={cat.id} value={String(cat.id)}>
                                    {cat.name_es || cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Country Filter */}
                    <Select
                        value={filters.countryId || 'Todos'}
                        onValueChange={(val) => {
                            setFilters(prev => ({
                                ...prev,
                                countryId: val === 'Todos' ? '' : val,
                                stateId: '', // Reset state when country changes
                                page: 1
                            }));
                        }}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="País" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todos los Países</SelectItem>
                            {countries?.map((country) => (
                                <SelectItem key={country.id} value={String(country.id)}>
                                    {country.name_es || country.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* State Filter */}
                    <Select
                        value={filters.stateId || 'Todos'}
                        onValueChange={(val) => handleFilterChange('stateId', val)}
                        disabled={!filters.countryId}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Estado/Región" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todos los Estados</SelectItem>
                            {availableStates?.map((state) => (
                                <SelectItem key={state.id} value={String(state.id)}>
                                    {state.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Sort Filter */}
                    <Select
                        value={filters.sortBy || 'newest'}
                        onValueChange={(val) => handleFilterChange('sortBy', val)}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Más recientes</SelectItem>
                            <SelectItem value="price_asc">Precio: Menor a Mayor</SelectItem>
                            <SelectItem value="price_desc">Precio: Mayor a Menor</SelectItem>
                            <SelectItem value="rating">Mejor calificados</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Price Range */}
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min $"
                            className="h-11 w-full"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        />
                        <span className="text-slate-400">-</span>
                        <Input
                            type="number"
                            placeholder="Max $"
                            className="h-11 w-full"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
