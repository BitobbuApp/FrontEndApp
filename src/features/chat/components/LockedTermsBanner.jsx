import React from 'react';
import { Lock } from 'lucide-react';

export default function LockedTermsBanner({ terms }) {
    if (!terms) return null;

    return (
        <div className="flex items-center gap-2 bg-[#D2FC31] px-4 py-1.5 text-xs font-semibold text-[#0B2046]">
            <Lock className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">
                Trato cerrado · {terms.quantityLabel} · {terms.totalLabel} · Entrega {terms.deliveryLabel}
            </span>
        </div>
    );
}
