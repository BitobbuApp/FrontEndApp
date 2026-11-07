import React from 'react';
import { Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Marks a direct RFQ (sent from a marketplace product to a single supplier).
 * perspective: 'buyer' shows the target supplier, 'supplier' highlights it is addressed to you.
 */
export default function DirectRequestBadge({ request, perspective = 'buyer', className }) {
    if (!request?.is_direct) return null;

    const label = perspective === 'supplier'
        ? 'Solicitud directa para ti'
        : `Directa · ${request.target_company?.trade_name || 'Proveedor'}`;

    return (
        <Badge
            variant="outline"
            className={cn(
                'text-[10px] px-1.5 py-0 h-5 gap-1 font-semibold border-[#0B2046]/20 bg-[#D2FC31]/40 text-[#0B2046]',
                className
            )}
        >
            <Store className="w-3 h-3" />
            {label}
        </Badge>
    );
}
