import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

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

export default function ProductGrid({ filteredProducts, handleViewDetail }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
            {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                    <Card
                        className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group rounded-2xl flex flex-col h-full"
                        onClick={() => handleViewDetail(product)}
                    >
                        <div className="aspect-square bg-slate-100 relative overflow-hidden flex-shrink-0">
                            {product.photos?.[0]?.url ? (
                                <img
                                    src={product.photos[0].url}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-16 h-16 text-slate-300" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>
                        <CardContent className="p-4 flex flex-col flex-1">
                            <h3 className="font-medium text-[13px] sm:text-sm text-slate-700 line-clamp-2 leading-snug min-h-[40px] mb-2">
                                {product.name}
                            </h3>
                            
                            <div className="mt-auto">
                                <p className="text-base sm:text-lg font-extrabold text-[#0B2046]">
                                    {getDisplayPrice(product).replace('$', 'USD ')}
                                </p>
                                <div className="flex items-center text-[11px] sm:text-xs text-slate-500 gap-1.5 mt-0.5">
                                    <span>Pedido min: {product.moq} {product.unit_of_measure}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>{product.id.charCodeAt(0) % 100 + 10} vendidos</span>
                                </div>
                            </div>
                            
                            {/* Mock Envío Gratis */}
                            {product.id.charCodeAt(1) % 2 === 0 && (
                                <div className="flex items-center gap-1 text-[11px] font-bold text-[#0B2046] mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="2" y="6" rx="2"/><path d="M18 10h4v6h-4M6 21v-2M14 21v-2"/></svg>
                                    ENVÍO GRATIS
                                </div>
                            )}
                            
                            <div className="mt-3 pt-3 border-t border-slate-100">
                                <span className="text-xs text-blue-600 hover:underline line-clamp-1 mb-1 font-medium">
                                    {product.company_details?.trade_name || 'Proveedor'}
                                </span>
                                <div className="flex items-center text-[10px] sm:text-[11px] text-slate-500 gap-1">
                                    <span className="font-bold text-slate-700">Verificado</span>
                                    <span>-</span>
                                    <span className="flex items-center text-amber-500 font-medium">{product.company_details?.average_rating || 5.0} ⭐</span>
                                    <span>-</span>
                                    <span className="line-clamp-1">{product.company_details?.locations?.[0] ? 'Distrito Capital' : 'Venezuela'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}
