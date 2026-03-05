import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Tag, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import RatingStars from '@/components/ui/RatingStars';
import EmptyState from '@/components/ui/EmptyState';

export default function OffersOfInterestTable({ ofertas, isLoading }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold text-[#1E293B]">
                        Ofertas de Interés
                    </CardTitle>
                    <Link
                        to={createPageUrl('Offers')}
                        className="text-sm text-slate-500 hover:text-[#1E293B] flex items-center gap-1"
                    >
                        Ver todas <ArrowRight className="w-4 h-4" />
                    </Link>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-12 bg-slate-100 rounded-lg animate-pulse"
                                />
                            ))}
                        </div>
                    ) : ofertas.length === 0 ? (
                        <EmptyState
                            icon={Tag}
                            title="Sin ofertas pendientes"
                            description="Las ofertas de proveedores aparecerán aquí"
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-slate-500 font-medium">
                                        Proveedor
                                    </TableHead>
                                    <TableHead className="text-slate-500 font-medium">
                                        Producto
                                    </TableHead>
                                    <TableHead className="text-slate-500 font-medium text-right">
                                        Precio
                                    </TableHead>
                                    <TableHead className="text-slate-500 font-medium text-right">
                                        Acción
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ofertas.map((oferta) => (
                                    <TableRow key={oferta.id} className="hover:bg-slate-50/50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-[#D2FC31] flex items-center justify-center text-sm font-medium text-[#1E293B]">
                                                    {oferta.proveedor_nombre?.[0] || 'P'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#1E293B] text-sm">
                                                        {oferta.proveedor_nombre || 'Proveedor'}
                                                    </p>
                                                    <RatingStars
                                                        rating={oferta.proveedor_calificacion || 0}
                                                        size="sm"
                                                        showValue={false}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600 text-sm">
                                            {oferta.producto_nombre}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-[#1E293B]">
                                            ${oferta.precio_unitario?.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                to={createPageUrl('Offers') + `?id=${oferta.id}`}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-500 hover:text-[#1E293B]"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Ver
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
