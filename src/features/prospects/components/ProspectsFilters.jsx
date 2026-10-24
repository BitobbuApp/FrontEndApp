import React, { useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';
import SubcategorySelect from '@/features/appMetadata/components/SubcategorySelect';
import { findSubcategoryCategory } from '@/features/appMetadata/utils/subcategoryGroups';

const ALL = 'Todas';

/**
 * Opportunities filters. The supplier's own categories / subcategories (profile) are listed first;
 * "Solo mis subcategorías" shows only RFQs of the subcategories it works with.
 */
export default function ProspectsFilters({
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    myCategoryValues = [],
    hasMySubcategories = false,
}) {
    const { categoryOptions, subcategoryOptions } = useAppMetadata();

    const { mine, others } = useMemo(() => {
        const ownSet = new Set(myCategoryValues);
        return {
            mine: categoryOptions.filter((category) => ownSet.has(category.value)),
            others: categoryOptions.filter((category) => !ownSet.has(category.value)),
        };
    }, [categoryOptions, myCategoryValues]);

    const handleCategoryChange = (value) => {
        const categoryId = value === ALL ? '' : value;
        setFilters((prev) => ({
            ...prev,
            categoryId,
            subcategoryId: prev.subcategoryId && findSubcategoryCategory(subcategoryOptions, prev.subcategoryId) === categoryId
                ? prev.subcategoryId
                : '',
        }));
    };

    const handleSubcategoryChange = (subcategoryId, categoryId) => {
        setFilters((prev) => ({
            ...prev,
            subcategoryId,
            ...(subcategoryId && categoryId && { categoryId }),
        }));
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-3">
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Buscar por producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>

                    <Select value={filters.categoryId || ALL} onValueChange={handleCategoryChange} disabled={filters.onlyMine}>
                        <SelectTrigger className="w-full lg:w-56 h-11">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>Todas las categorías</SelectItem>
                            {mine.length > 0 && (
                                <>
                                    <SelectSeparator />
                                    <SelectGroup>
                                        <SelectLabel>Mis categorías</SelectLabel>
                                        {mine.map((category) => (
                                            <SelectItem key={category.id} value={category.value}>{category.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </>
                            )}
                            {others.length > 0 && (
                                <>
                                    <SelectSeparator />
                                    <SelectGroup>
                                        {mine.length > 0 && <SelectLabel>Otras categorías</SelectLabel>}
                                        {others.map((category) => (
                                            <SelectItem key={category.id} value={category.value}>{category.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </>
                            )}
                        </SelectContent>
                    </Select>

                    <SubcategorySelect
                        categoryValue={filters.categoryId}
                        value={filters.subcategoryId}
                        onChange={handleSubcategoryChange}
                        priorityCategoryValues={myCategoryValues}
                        placeholder={filters.categoryId ? 'Todas las subcategorías' : 'Buscar subcategoría'}
                        disabled={filters.onlyMine}
                        className="w-full lg:w-64"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Switch
                        id="only-my-subcategories"
                        checked={filters.onlyMine}
                        onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, onlyMine: checked, categoryId: '', subcategoryId: '' }))}
                        disabled={!hasMySubcategories}
                    />
                    <Label htmlFor="only-my-subcategories" className="text-sm text-slate-600 cursor-pointer">
                        Solo mis subcategorías
                    </Label>
                    {!hasMySubcategories && (
                        <span className="text-xs text-slate-400">
                            (agrega tus subcategorías en Configuración → Comercial)
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
