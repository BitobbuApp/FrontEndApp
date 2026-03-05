import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function RequestsHeader({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onNewSolicitud,
}) {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
                        Mis Solicitudes
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gestiona tus solicitudes de cotización
                    </p>
                </div>
                <Button
                    onClick={onNewSolicitud}
                    className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d] font-semibold px-6 h-12 rounded-xl"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Solicitud
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Buscar por producto..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 h-11"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                            <SelectTrigger className="w-full sm:w-48 h-11">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="Activo">Activo</SelectItem>
                                <SelectItem value="Pausada">Pausada</SelectItem>
                                <SelectItem value="Vencida">Vencida</SelectItem>
                                <SelectItem value="Concretada">Concretada</SelectItem>
                                <SelectItem value="Por expirar">Por expirar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
