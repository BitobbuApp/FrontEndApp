import React from 'react';
import { motion } from 'framer-motion';
import { Package, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RatingStars from '@/components/ui/RatingStars';

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
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                    <Card
                        className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
                        onClick={() => handleViewDetail(product)}
                    >
                        <div className="aspect-square bg-slate-100 relative overflow-hidden">
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
                            {product.supplier_type && (
                                <Badge className="absolute top-3 left-3 bg-[#1E293B]/80 text-white">
                                    {product.supplier_type}
                                </Badge>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                        <CardContent className="p-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground line-clamp-1">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Building2 className="w-4 h-4" />
                                    <span className="line-clamp-1">
                                        {product.company_details?.trade_name || 'Proveedor'}
                                    </span>
                                </div>
                                <RatingStars rating={product.company_details?.average_rating || 0} size="sm" />
                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <p className="text-xl font-bold text-foreground">
                                            {getDisplayPrice(product)}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            MOQ: {product.moq} {product.unit_of_measure}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="text-xs max-w-[50%] truncate">
                                        {product.category || 'Categoría'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}
