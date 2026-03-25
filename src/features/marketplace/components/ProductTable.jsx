import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Eye, MessageSquare, Package, Building2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RatingStars from '@/components/ui/RatingStars';

export default function ProductTable({ filteredProducts, handleViewDetail }) {
    return (
        <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="text-slate-500 font-medium">Producto</TableHead>
                            <TableHead className="text-slate-500 font-medium">Proveedor</TableHead>
                            <TableHead className="text-slate-500 font-medium">Categoría</TableHead>
                            <TableHead className="text-slate-500 font-medium">Precio</TableHead>
                            <TableHead className="text-slate-500 font-medium">MOQ</TableHead>
                            <TableHead className="text-slate-500 font-medium">Rating</TableHead>
                            <TableHead className="text-slate-500 font-medium text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id} className="hover:bg-muted/50/50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                            {product.fotos_urls?.[0] ? (
                                                <img
                                                    src={product.fotos_urls[0]}
                                                    alt={product.nombre}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{product.nombre}</p>
                                            {product.descripcion && (
                                                <p className="text-xs text-slate-500 line-clamp-1">
                                                    {product.descripcion}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">
                                            {product.proveedor_nombre || 'Proveedor'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="text-xs">
                                        {product.categoria}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-bold text-foreground">
                                    ${product.precio?.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    {product.moq} unidades
                                </TableCell>
                                <TableCell>
                                    <RatingStars rating={product.calificacion || 0} size="sm" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewDetail(product)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Ver
                                        </Button>
                                        <Link
                                            to={
                                                createPageUrl('Chat') +
                                                `?proveedor=${product.proveedor_id}`
                                            }
                                        >
                                            <Button
                                                size="sm"
                                                className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]"
                                            >
                                                <MessageSquare className="w-4 h-4 mr-1" />
                                                Contactar
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
