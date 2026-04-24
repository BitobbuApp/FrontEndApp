import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import ViewToggle from '@/components/shared/ViewToggle';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function RequestsHeader({
    statusFilter,
    onStatusFilterChange,
    onNewSolicitud,
    viewMode,
    onViewModeChange,
}) {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        Mis Solicitudes
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gestiona tus solicitudes de cotización
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden sm:block">
                        <ViewToggle mode={viewMode} onChange={onViewModeChange} />
                    </span>
                    <Button
                        onClick={onNewSolicitud}
                        className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] font-semibold px-6 h-12 rounded-xl"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nueva Solicitud
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <div className="w-full sm:w-64">
                            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                                <SelectTrigger className="w-full h-11">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="Active">Activo</SelectItem>
                                    <SelectItem value="Paused">Pausada</SelectItem>
                                    <SelectItem value="Expired">Vencida</SelectItem>
                                    <SelectItem value="Completed">Concretada</SelectItem>
                                    <SelectItem value="Expiring_Soon">Por expirar</SelectItem>
                                    <SelectItem value="Closed">Cerrada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
