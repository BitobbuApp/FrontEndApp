import React from 'react';
import { Flame, Zap, TrendingUp, TrendingDown, ArrowUpDown, FileText, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';

// --- Mock data for the quote responses (endpoint not yet available) ---
// Once GET /quote-responses?request_id=xxx is built, replace this with a useQuery call.
const MOCK_RESPONSES = [
    {
        id: '1',
        supplier: { name: 'Global Importaciones VE', initial: 'G', rating: 4.3, verified: true },
        payment_conditions: 'Negociable',
        unit_price: 12,
        total_amount: 1800,
        delivery_time: '2',
        status: 'Pending',
    },
    {
        id: '2',
        supplier: { name: 'Capi Rosse', initial: 'C', rating: 6.0, verified: false },
        payment_conditions: 'Negociable',
        unit_price: 20,
        total_amount: 4000,
        delivery_time: '3',
        status: 'Pending',
    },
];

// Derive stats from mock responses
function getStats(responses) {
    if (!responses.length) return null;
    const amounts = responses.map((r) => r.total_amount);
    const max = Math.max(...amounts);
    const min = Math.min(...amounts);
    const avg = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);
    const best = responses.reduce((prev, curr) => (curr.total_amount < prev.total_amount ? curr : prev));
    const fastest = responses.reduce((prev, curr) =>
        Number(curr.delivery_time) < Number(prev.delivery_time) ? curr : prev
    );
    return { max, min, avg, best, fastest };
}

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Accepted: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Negotiating: 'bg-blue-100 text-blue-700',
    Expired: 'bg-slate-100 text-slate-500',
};

const statusLabels = {
    Pending: 'Pendiente',
    Accepted: 'Aceptada',
    Rejected: 'Rechazada',
    Negotiating: 'Negociando',
    Expired: 'Expirada',
};

export default function RequestRowExpanded({ request }) {
    // TODO: Replace MOCK_RESPONSES with actual API data when endpoint is available:
    // const { data: responses = [] } = useQuery({
    //     queryKey: ['quote-responses', request.id],
    //     queryFn: () => quoteResponsesApi.getQuoteResponsesByRequestId(request.id, { limit: 5 }),
    //     enabled: !!request.id,
    // });
    const responses = MOCK_RESPONSES;
    const stats = getStats(responses);

    return (
        <div className="bg-muted/50 border-y border-border p-6 space-y-5">
            {/* Highlight cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Best Price */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-xs font-semibold text-green-600 flex items-center gap-1 mb-1">
                            <Flame className="w-3.5 h-3.5" />
                            Mejor Oferta (precio más bajo)
                        </p>
                        <p className="text-3xl font-bold text-green-700">${stats.best.total_amount.toLocaleString()}</p>
                        <p className="text-xs text-green-600 mt-1">por {stats.best.supplier.name}</p>
                    </div>
                    {/* Fastest Delivery */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-xs font-semibold text-yellow-600 flex items-center gap-1 mb-1">
                            <Zap className="w-3.5 h-3.5" />
                            Entrega más rápida
                        </p>
                        <p className="text-3xl font-bold text-yellow-700">{stats.fastest.delivery_time}</p>
                        <p className="text-xs text-yellow-600 mt-1">por {stats.fastest.supplier.name}</p>
                    </div>
                </div>
            )}

            {/* Description */}
            {request.description && (
                <div className="bg-background rounded-xl border border-border p-4">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Descripción</p>
                    <p className="text-sm text-slate-700">{request.description}</p>
                </div>
            )}

            {/* Price stats */}
            {stats && (
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center gap-1">
                        <TrendingUp className="w-5 h-5 text-red-400" />
                        <p className="text-xs text-red-500">Más alto</p>
                        <p className="font-bold text-red-600">${stats.max.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center gap-1">
                        <ArrowUpDown className="w-5 h-5 text-blue-400" />
                        <p className="text-xs text-blue-500">Promedio</p>
                        <p className="font-bold text-blue-600">${stats.avg.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center gap-1">
                        <TrendingDown className="w-5 h-5 text-green-400" />
                        <p className="text-xs text-green-500">Más bajo</p>
                        <p className="font-bold text-green-600">${stats.min.toLocaleString()}</p>
                    </div>
                </div>
            )}

            {/* Quote responses table */}
            <div>
                <p className="text-sm font-semibold text-foreground mb-3">
                    Últimas Ofertas ({responses.length})
                </p>
                {responses.length === 0 ? (
                    <div className="bg-background rounded-xl border border-border p-6 text-center">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Aún no hay ofertas para esta solicitud</p>
                    </div>
                ) : (
                    <div className="bg-background rounded-xl border border-border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Proveedor</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Condiciones</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Precio Unit.</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Total</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Entrega</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Estado</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {responses.map((resp) => (
                                    <tr key={resp.id} className="hover:bg-muted/50/50 transition-colors">
                                        {/* Supplier */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                                                    {resp.supplier.initial}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground flex items-center gap-1">
                                                        {resp.supplier.name}
                                                        {resp.supplier.verified && (
                                                            <span className="text-blue-500">✓</span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-amber-500">★ {resp.supplier.rating}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Payment conditions */}
                                        <td className="px-4 py-3 text-slate-600">{resp.payment_conditions || '—'}</td>
                                        {/* Unit price */}
                                        <td className="px-4 py-3 text-right font-medium text-slate-700">
                                            ${resp.unit_price}
                                        </td>
                                        {/* Total */}
                                        <td className="px-4 py-3 text-right font-bold text-emerald-600">
                                            ${resp.total_amount.toLocaleString()}
                                        </td>
                                        {/* Delivery */}
                                        <td className="px-4 py-3 text-center text-slate-600">{resp.delivery_time}</td>
                                        {/* Status */}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[resp.status] || 'bg-slate-100 text-slate-500'}`}>
                                                {statusLabels[resp.status] || resp.status}
                                            </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    size="sm"
                                                    className="h-7 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                                                    disabled={resp.status !== 'Pending'}
                                                >
                                                    Aceptar
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                                                    disabled={resp.status !== 'Pending'}
                                                >
                                                    <span className="text-base leading-none">⊗</span>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
