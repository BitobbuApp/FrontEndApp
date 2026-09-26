import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Package, Play, FileText, MessageSquare } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RatingStars from '@/components/ui/RatingStars';

const getDisplayPrice = (product) => {
    if (product.pricing_tiers?.length > 0) {
        const prices = product.pricing_tiers.map(t => Number(t.price_usd));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        if (minPrice === maxPrice) return `$${minPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        return `$${minPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - $${maxPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${Number(product.base_price_usd || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function ProductDetailModal({
    open,
    onOpenChange,
    selectedProduct,
    selectedImageIndex,
    setSelectedImageIndex,
    handleRequestQuote,
}) {
    if (!selectedProduct) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalle del Producto</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                            {selectedProduct.photos?.[selectedImageIndex]?.url ? (
                                <img
                                    src={selectedProduct.photos[selectedImageIndex].url}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-24 h-24 text-slate-300" />
                                </div>
                            )}
                        </div>
                        {selectedProduct.photos?.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {selectedProduct.photos.map((photo, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedImageIndex === index
                                                ? 'border-[#D2FC31]'
                                                : 'border-transparent'
                                            }`}
                                    >
                                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">
                                    {selectedProduct.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary">{selectedProduct.category}</Badge>
                                    {selectedProduct.supplier_type && (
                                        <Badge variant="outline">
                                            {selectedProduct.supplier_type}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">
                                    {getDisplayPrice(selectedProduct)}
                                </p>
                                <p className="text-sm text-slate-500">por {selectedProduct.unit_of_measure || 'unidad'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                            <div className="w-12 h-12 rounded-lg bg-[#D2FC31] flex items-center justify-center text-lg font-bold text-slate-900">
                                {selectedProduct.company_details?.trade_name?.[0] || 'P'}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">
                                    {selectedProduct.company_details?.trade_name || 'Proveedor'}
                                </p>
                                <RatingStars rating={selectedProduct.company_details?.average_rating || 0} size="sm" />
                            </div>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-xl">
                            <p className="text-sm text-amber-700 font-medium">
                                Cantidad Mínima de Orden (MOQ): {selectedProduct.moq} {selectedProduct.unit_of_measure}
                            </p>
                        </div>

                        {selectedProduct.pricing_tiers?.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Precios por Volumen</h4>
                                <div className="bg-muted/30 rounded-lg overflow-hidden border border-border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-medium text-slate-500">Rango de Cantidad</th>
                                                <th className="px-4 py-2 text-right font-medium text-slate-500">Precio Unitario</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {[...selectedProduct.pricing_tiers]
                                                .sort((a, b) => a.min_quantity - b.min_quantity)
                                                .map((tier, index) => (
                                                <tr key={tier.id || index}>
                                                    <td className="px-4 py-2">
                                                        {tier.min_quantity} {tier.max_quantity ? `- ${tier.max_quantity}` : 'o más'} {selectedProduct.unit_of_measure || 'unidades'}
                                                    </td>
                                                    <td className="px-4 py-2 text-right font-semibold text-foreground">
                                                        ${Number(tier.price_usd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {selectedProduct.description && (
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Descripción</h4>
                                <p className="text-slate-600">{selectedProduct.description}</p>
                            </div>
                        )}

                        {selectedProduct.video_url && (
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Video</h4>
                                <a
                                    href={selectedProduct.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                >
                                    <Play className="w-4 h-4" />
                                    Ver video del producto
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleRequestQuote(selectedProduct)}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Solicitar Cotización
                        </Button>
                        <Link
                            to={createPageUrl('Chat') + `?proveedor=${selectedProduct.company_id}`}
                            className="flex-1"
                        >
                            <Button className="w-full bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Contactar Proveedor
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
