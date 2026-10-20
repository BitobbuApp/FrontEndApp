import React from 'react';
import { Store, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTierUnitPrice, formatUsd } from '@/features/marketplace/utils/pricing';

/**
 * Shown on the request form when the RFQ comes from a marketplace product:
 * the request goes directly to that supplier (no matching with other suppliers).
 */
export default function DirectOfferBanner({ offer, quantity, onRemove }) {
    if (!offer) return null;

    const unitPrice = getTierUnitPrice(offer, quantity);

    return (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-[#0B2046]/10 bg-[#0B2046]/5">
            <div className="w-10 h-10 rounded-full bg-[#D2FC31] flex items-center justify-center text-[#0B2046] flex-shrink-0">
                <Store className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0B2046]">
                    Solicitud directa a {offer.trade_name || 'el proveedor'}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                    Producto: <span className="font-medium">{offer.name}</span>
                    {unitPrice != null && (
                        <> · Precio de referencia: <span className="font-medium">{formatUsd(unitPrice)}</span> por unidad</>
                    )}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    Solo este proveedor recibirá tu solicitud y podrá iniciar la negociación contigo.
                </p>
            </div>
            {onRemove && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-slate-500 flex-shrink-0"
                    title="Enviar como solicitud abierta a todos los proveedores"
                >
                    <X className="w-4 h-4 mr-1" /> Quitar proveedor
                </Button>
            )}
        </div>
    );
}
