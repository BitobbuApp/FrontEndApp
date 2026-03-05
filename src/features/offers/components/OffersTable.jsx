import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Tag,
    Eye,
    Check,
    MessageSquare,
    Clock,
    Calendar,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/ui/StatusBadge';
import RatingStars from '@/components/ui/RatingStars';
import EmptyState from '@/components/ui/EmptyState';

export default function OffersTable({
    ofertas,
    isLoading,
    searchTerm,
    onAccept,
    onReject,
}) {
    if (isLoading) {
        return (
            <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (ofertas.length === 0) {
        return (
            <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    <EmptyState
                        icon={Tag}
                        title="Sin ofertas"
                        description={
                            searchTerm
                                ? 'No se encontraron ofertas con esos criterios'
                                : 'Las ofertas de proveedores aparecerán aquí'
                        }
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="text-slate-500 font-medium">Proveedor</TableHead>
                            <TableHead className="text-slate-500 font-medium">Producto</TableHead>
                            <TableHead className="text-slate-500 font-medium">Tipo</TableHead>
                            <TableHead className="text-slate-500 font-medium">Precio Unit.</TableHead>
                            <TableHead className="text-slate-500 font-medium">Precio Total</TableHead>
                            <TableHead className="text-slate-500 font-medium">Condiciones</TableHead>
                            <TableHead className="text-slate-500 font-medium">Estado</TableHead>
                            <TableHead className="text-slate-500 font-medium text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ofertas.map((oferta) => (
                            <TableRow key={oferta.id} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#D2FC31] flex items-center justify-center text-sm font-bold text-[#1E293B] flex-shrink-0">
                                            {oferta.proveedor_nombre?.[0] || 'P'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#1E293B]">
                                                {oferta.proveedor_nombre || 'Proveedor'}
                                            </p>
                                            <RatingStars
                                                rating={oferta.proveedor_calificacion || 0}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium text-[#1E293B]">
                                            {oferta.producto_nombre}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {oferta.cantidad} unidades
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {oferta.es_proactiva ? (
                                        <Badge className="bg-purple-100 text-purple-700">Anuncio</Badge>
                                    ) : (
                                        <Badge variant="secondary">Solicitud</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="font-semibold text-[#1E293B]">
                                    ${oferta.precio_unitario?.toLocaleString()}
                                </TableCell>
                                <TableCell className="font-bold text-[#1E293B]">
                                    $
                                    {(
                                        oferta.precio_unitario * oferta.cantidad
                                    )?.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-sm text-slate-600">
                                            <Clock className="w-3 h-3" />
                                            {oferta.condiciones_pago}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-slate-600">
                                            <Calendar className="w-3 h-3" />
                                            {oferta.tiempo_entrega}
                                        </div>
                                        <p className="text-xs text-amber-600">
                                            Válida hasta{' '}
                                            {format(
                                                new Date(oferta.created_date).setDate(
                                                    new Date(oferta.created_date).getDate() + 15,
                                                ),
                                                'd/M',
                                                { locale: es },
                                            )}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={oferta.estado} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {oferta.estado === 'Pendiente' ? (
                                            <>
                                                <Link
                                                    to={
                                                        createPageUrl('Chat') +
                                                        `?proveedor=${oferta.proveedor_id}`
                                                    }
                                                >
                                                    <Button variant="outline" size="sm">
                                                        <MessageSquare className="w-4 h-4 mr-1" />
                                                        Negociar
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
                                                    onClick={() => onAccept(oferta.id)}
                                                >
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Aceptar
                                                </Button>
                                            </>
                                        ) : (
                                            <Button variant="ghost" size="sm" disabled>
                                                {oferta.estado}
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
