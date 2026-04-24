import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Tag, ArrowRight, MessageCircle } from 'lucide-react';
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
import EmptyState from '@/components/ui/EmptyState';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function OffersOfInterestTable({ ofertas, isLoading }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Ofertas para ti
                    </CardTitle>
                    <Link
                        to={createPageUrl('Prospects')}
                        className="text-sm text-slate-500 hover:text-foreground flex items-center gap-1"
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
                                    <TableHead className="text-slate-500 font-medium text-right">
                                        Precio
                                    </TableHead>
                                    <TableHead className="text-slate-500 font-medium text-right">
                                        Fecha
                                    </TableHead>
                                    <TableHead className="text-slate-500 font-medium text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ofertas.map((oferta) => (
                                    <TableRow key={oferta.id} className="hover:bg-muted/50/50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-700">
                                                    {oferta.supplier?.trade_name?.[0] || 'P'}
                                                </div>
                                                <p className="font-medium text-foreground text-sm">
                                                    {oferta.supplier?.trade_name || 'Proveedor'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-foreground">
                                            ${Number(oferta.unit_price_usd || 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-slate-500">
                                            {oferta.created_at
                                                ? format(new Date(oferta.created_at), 'dd MMM', { locale: es })
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-500 hover:text-foreground"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                            </Button>
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
