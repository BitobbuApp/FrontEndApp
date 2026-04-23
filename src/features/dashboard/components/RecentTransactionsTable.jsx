import { motion } from 'framer-motion';
import { ShoppingCart, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Pagination from '@/components/atoms/Pagination';
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

export default function RecentTransactionsTable({
    transactions,
    isLoading,
    companyId,
    currentPage,
    totalPages,
    totalItems,
    onPageChange
}) {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
        });
    };

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="w-full"
        >
            <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4 bg-white">
                    <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-indigo-500" />
                        Transacciones Recientes
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-12 bg-slate-50 border border-slate-100 rounded-lg animate-pulse"
                                />
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="py-12">
                            <EmptyState
                                icon={ShoppingCart}
                                title="Sin transacciones"
                                description="Tus compras y ventas cerradas aparecerán aquí."
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="text-slate-500 font-semibold py-4 px-6">
                                            Descripción / Contraparte
                                        </TableHead>
                                        <TableHead className="text-slate-500 font-semibold py-4 text-center">
                                            Estado
                                        </TableHead>
                                        <TableHead className="text-slate-500 font-semibold py-4 text-right pr-6">
                                            Total
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((tra) => {
                                        const isBuyer = tra.buyer_id === companyId;
                                        const otherParty = isBuyer ? tra.supplier_name : tra.buyer_name;
                                        
                                        return (
                                            <TableRow key={tra.id} className="group hover:bg-slate-50 transition-colors border-slate-100">
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-800 line-clamp-1">
                                                            {tra.product_description}
                                                        </span>
                                                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                            {isBuyer ? 'Proveedor: ' : 'Comprador: '}
                                                            <span className="text-indigo-600 font-medium">{otherParty || 'Empresa'}</span>
                                                            <span className="mx-1">•</span>
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(tra.created_at)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <StatusBadge status={tra.status} />
                                                </TableCell>
                                                <TableCell className="py-4 text-right pr-6">
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-bold text-slate-900">
                                                            ${Number(tra.total_amount_usd).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            {!isLoading && transactions.length > 0 && (
                                <Pagination
                                    totalItems={totalItems}
                                    itemsLabel="transacción"
                                    itemsLabelPlural="transacciones"
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={onPageChange}
                                    className="bg-slate-50/50"
                                />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
