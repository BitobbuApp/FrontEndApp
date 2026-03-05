import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, Eye } from 'lucide-react';
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
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';

export default function RecentQuotationsTable({
    solicitudes,
    isLoading,
    onNewSolicitud,
}) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold text-[#1E293B]">
                        Cotizaciones Recientes
                    </CardTitle>
                    <Link
                        to={createPageUrl('Requests')}
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
                    ) : solicitudes.length === 0 ? (
                        <EmptyState
                            icon={FileText}
                            title="Sin solicitudes"
                            description="Crea tu primera solicitud de cotización"
                            actionLabel="Nueva Solicitud"
                            onAction={onNewSolicitud}
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-slate-500 font-medium">
                                        Producto
                                    </TableHead>
                                    <TableHead className="text-slate-500 font-medium">
                                        Estado
                                    </TableHead>
                                    <TableHead className="text-slate-500 font-medium text-center">
                                        Ofertas
                                    </TableHead>
                                    <TableHead className="text-slate-500 font-medium text-right">
                                        Acción
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {solicitudes.map((sol) => (
                                    <TableRow key={sol.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-medium text-[#1E293B]">
                                            {sol.producto_servicio}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={sol.estado} />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-medium">
                                                {sol.numero_ofertas || 0}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                to={
                                                    createPageUrl('Requests') + `?id=${sol.id}`
                                                }
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
