import React from 'react';
import { Check, Circle } from 'lucide-react';

const Row = ({ label, value, strong = false }) => (
    <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="text-slate-500">{label}</span>
        <span className={`text-right ${strong ? 'font-bold text-[#0B2046]' : 'text-slate-700'}`}>{value}</span>
    </div>
);

const Approval = ({ label, approved, hint }) => (
    <span
        className={`flex items-center gap-1.5 text-xs font-medium ${approved ? 'text-emerald-700' : 'text-slate-400'}`}
        title={hint}
    >
        {approved ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
        {label}
    </span>
);

/**
 * Summary of the deal terms (read-only). Approvals reflect the real flow:
 * supplier = sent the formal quote, buyer = accepted it.
 */
export default function DealTermsCard({ stage }) {
    if (!stage?.showTerms) return null;
    const { terms, approvals } = stage;

    return (
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-white p-4 shadow-sm">
            <p className="mb-3 border-b border-border pb-2 text-sm font-semibold text-[#0B2046]">
                Confirmar términos del trato
            </p>
            <div className="space-y-1.5">
                <Row label="Producto" value={terms.product || '—'} />
                <Row label="Cantidad" value={terms.quantityLabel} />
                <Row label="Total" value={terms.totalLabel} strong />
                <Row label="Entrega" value={terms.deliveryLabel} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                <Approval label="Comprador" approved={approvals.buyer} hint="El comprador acepta la cotización" />
                <Approval label="Proveedor" approved={approvals.supplier} hint="El proveedor envía la cotización formal" />
            </div>
        </div>
    );
}
