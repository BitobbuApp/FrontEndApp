import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

export default function ProspectsFilters({
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
}) {
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Buscar por producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-48 h-11">
                            <Filter className="w-4 h-4 mr-2" />
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
                </div>
            </CardContent>
        </Card>
    );
}
