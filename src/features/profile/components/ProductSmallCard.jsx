import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Tag } from 'lucide-react';

export default function ProductSmallCard({ product }) {
    const imageUrl = product.photos?.[0]?.url;

    return (
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="aspect-square bg-muted/50 relative overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-slate-200" />
                    </div>
                )}
                {product.base_price && (
                    <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-border">
                        <span className="text-sm font-bold text-foreground">
                            ${Number(product.base_price).toLocaleString()}
                        </span>
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    <Badge className="bg-[#D2FC31] text-slate-900 hover:bg-[#D2FC31] border-0 text-[10px] px-2">
                        {product.category || 'General'}
                    </Badge>
                </div>
            </div>
            <CardContent className="p-3 space-y-1">
                <h4 className="font-semibold text-slate-800 text-sm truncate" title={product.name}>
                    {product.name}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {product.unit_of_measure || 'Units'}
                    </span>
                    {product.moq > 1 && (
                        <span>Min: {product.moq}</span>
                    )}
                </div>
                {product.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-tight">
                        {product.description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
