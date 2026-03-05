import React from 'react';
import { Search, Grid3x3, List } from 'lucide-react';
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

export const CATEGORIAS = [
    'Todas',
    'Alimentos',
    'Ferretería',
    'Salud',
    'IT',
    'Automotriz',
    'Embalaje',
    'Químicos',
    'Oficina',
    'Textil',
];
export const TIPOS = ['Todos', 'Fabricante', 'Mayorista', 'Distribuidor'];

export default function MarketplaceFilters({
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    viewMode,
    setViewMode,
}) {
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-40 h-11">
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIAS.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-40 h-11">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {TIPOS.map((tipo) => (
                                    <SelectItem key={tipo} value={tipo}>
                                        {tipo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Tabs value={viewMode} onValueChange={setViewMode}>
                            <TabsList>
                                <TabsTrigger value="grid">
                                    <Grid3x3 className="w-4 h-4" />
                                </TabsTrigger>
                                <TabsTrigger value="table">
                                    <List className="w-4 h-4" />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
