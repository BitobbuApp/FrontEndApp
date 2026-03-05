import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export const SECTORES = [
    'Todos',
    'Alimentos',
    'Ferretería',
    'Salud',
    'IT',
    'Automotriz',
    'Embalaje',
    'Químicos',
    'Oficina',
    'Textil',
    'Logística',
    'Mantenimiento',
    'Seguridad',
    'Marketing',
    'Legal',
    'RRHH',
];
export const PLANES = ['Todos', 'Premium', 'Gratuito'];
export const RATINGS = ['Todos', '4+ Estrellas', '3+ Estrellas'];

export default function SuppliersFilters({
    searchTerm,
    setSearchTerm,
    sectorFilter,
    setSectorFilter,
    planFilter,
    setPlanFilter,
    ratingFilter,
    setRatingFilter,
}) {
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Buscar proveedor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Select value={sectorFilter} onValueChange={setSectorFilter}>
                            <SelectTrigger className="w-40 h-11">
                                <SelectValue placeholder="Sector" />
                            </SelectTrigger>
                            <SelectContent>
                                {SECTORES.map((sector) => (
                                    <SelectItem key={sector} value={sector}>
                                        {sector}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={planFilter} onValueChange={setPlanFilter}>
                            <SelectTrigger className="w-36 h-11">
                                <SelectValue placeholder="Nivel" />
                            </SelectTrigger>
                            <SelectContent>
                                {PLANES.map((plan) => (
                                    <SelectItem key={plan} value={plan}>
                                        {plan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={ratingFilter} onValueChange={setRatingFilter}>
                            <SelectTrigger className="w-36 h-11">
                                <SelectValue placeholder="Rating" />
                            </SelectTrigger>
                            <SelectContent>
                                {RATINGS.map((rating) => (
                                    <SelectItem key={rating} value={rating}>
                                        {rating}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
