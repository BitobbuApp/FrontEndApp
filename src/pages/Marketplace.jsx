import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  MessageSquare,
  FileText,
  Package,
  Building2,
  Play,
  Grid3x3,
  List
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import RatingStars from '@/components/ui/RatingStars';
import EmptyState from '@/components/ui/EmptyState';
import SolicitudModal from '@/components/solicitud/SolicitudModal';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CATEGORIAS = ['Todas', 'Alimentos', 'Ferretería', 'Salud', 'IT', 'Automotriz', 'Embalaje', 'Químicos', 'Oficina', 'Textil'];
const TIPOS = ['Todos', 'Fabricante', 'Mayorista', 'Distribuidor'];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [solicitudModalOpen, setSolicitudModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid');

  const { data: productos = [], isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: () => base44.entities.ProductoCatalogo.filter({ activo: true }, '-created_date'),
  });

  const filteredProducts = productos.filter(prod => {
    const matchesSearch = 
      prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.proveedor_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || prod.categoria === categoryFilter;
    const matchesType = typeFilter === 'Todos' || prod.tipo_proveedor === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setDetailModalOpen(true);
  };

  const handleRequestQuote = (product) => {
    setSelectedProduct(product);
    setDetailModalOpen(false);
    setSolicitudModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
          Marketplace Mayorista
        </h1>
        <p className="text-slate-500 mt-1">
          Explora productos de proveedores verificados
        </p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 h-11">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 h-11">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList>
                  <TabsTrigger value="grid">
                    <Grid3x3 className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="table">
                    <List className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      {isLoading ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <EmptyState
              icon={ShoppingBag}
              title="Sin productos"
              description={searchTerm || categoryFilter !== 'Todas'
                ? "No se encontraron productos con esos criterios"
                : "Los productos del marketplace aparecerán aquí"}
            />
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
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
                    <img src={product.fotos_urls[0]} alt={product.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                    <h3 className="font-semibold text-[#1E293B] line-clamp-1">{product.nombre}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Building2 className="w-4 h-4" />
                      <span className="line-clamp-1">{product.proveedor_nombre || 'Proveedor'}</span>
                    </div>
                    <RatingStars rating={product.calificacion || 0} size="sm" />
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-xl font-bold text-[#1E293B]">${product.precio?.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">MOQ: {product.moq} unidades</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{product.categoria}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-slate-500 font-medium">Producto</TableHead>
                  <TableHead className="text-slate-500 font-medium">Proveedor</TableHead>
                  <TableHead className="text-slate-500 font-medium">Categoría</TableHead>
                  <TableHead className="text-slate-500 font-medium">Precio</TableHead>
                  <TableHead className="text-slate-500 font-medium">MOQ</TableHead>
                  <TableHead className="text-slate-500 font-medium">Rating</TableHead>
                  <TableHead className="text-slate-500 font-medium text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                          {product.fotos_urls?.[0] ? (
                            <img src={product.fotos_urls[0]} alt={product.nombre} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1E293B]">{product.nombre}</p>
                          {product.descripcion && (
                            <p className="text-xs text-slate-500 line-clamp-1">{product.descripcion}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{product.proveedor_nombre || 'Proveedor'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {product.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-[#1E293B]">
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
                        <Link to={createPageUrl('Chat') + `?proveedor=${product.proveedor_id}`}>
                          <Button size="sm" className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]">
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
      )}

      {/* Product Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Producto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                  {selectedProduct.fotos_urls?.[selectedImageIndex] ? (
                    <img 
                      src={selectedProduct.fotos_urls[selectedImageIndex]} 
                      alt={selectedProduct.nombre}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-24 h-24 text-slate-300" />
                    </div>
                  )}
                </div>
                {selectedProduct.fotos_urls?.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedProduct.fotos_urls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                          selectedImageIndex === index ? 'border-[#D2FC31]' : 'border-transparent'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#1E293B]">
                      {selectedProduct.nombre}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{selectedProduct.categoria}</Badge>
                      {selectedProduct.tipo_proveedor && (
                        <Badge variant="outline">{selectedProduct.tipo_proveedor}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#1E293B]">
                      ${selectedProduct.precio?.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">por unidad</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-[#D2FC31] flex items-center justify-center text-lg font-bold text-[#1E293B]">
                    {selectedProduct.proveedor_nombre?.[0] || 'P'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1E293B]">
                      {selectedProduct.proveedor_nombre || 'Proveedor'}
                    </p>
                    <RatingStars rating={selectedProduct.calificacion || 0} size="sm" />
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl">
                  <p className="text-sm text-amber-700 font-medium">
                    Cantidad Mínima de Orden (MOQ): {selectedProduct.moq} unidades
                  </p>
                </div>

                {selectedProduct.descripcion && (
                  <div>
                    <h4 className="font-semibold text-[#1E293B] mb-2">Descripción</h4>
                    <p className="text-slate-600">{selectedProduct.descripcion}</p>
                  </div>
                )}

                {selectedProduct.video_url && (
                  <div>
                    <h4 className="font-semibold text-[#1E293B] mb-2">Video</h4>
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
                <Link to={createPageUrl('Chat') + `?proveedor=${selectedProduct.proveedor_id}`} className="flex-1">
                  <Button className="w-full bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contactar Proveedor
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <SolicitudModal
        open={solicitudModalOpen}
        onOpenChange={setSolicitudModalOpen}
      />
    </div>
  );
}
