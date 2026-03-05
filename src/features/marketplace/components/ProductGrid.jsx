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
                            {product.fotos_urls?.[0] ? (
                                <img
                                    src={product.fotos_urls[0]}
                                    alt={product.nombre}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-16 h-16 text-slate-300" />
                                </div>
                            )}
                            {product.tipo_proveedor && (
                                <Badge className="absolute top-3 left-3 bg-[#1E293B]/80 text-white">
                                    {product.tipo_proveedor}
                                </Badge>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                        <CardContent className="p-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-[#1E293B] line-clamp-1">
                                    {product.nombre}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Building2 className="w-4 h-4" />
                                    <span className="line-clamp-1">
                                        {product.proveedor_nombre || 'Proveedor'}
                                    </span>
                                </div>
                                <RatingStars rating={product.calificacion || 0} size="sm" />
                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <p className="text-xl font-bold text-[#1E293B]">
                                            ${product.precio?.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            MOQ: {product.moq} unidades
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {product.categoria}
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
