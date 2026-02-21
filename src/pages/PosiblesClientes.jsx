import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Users,
  Search,
  Filter,
  Eye,
  MessageSquare,
  X,
  Calendar,
  Package,
  Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import StatusBadge from '@/components/ui/StatusBadge';
import RatingStars from '@/components/ui/RatingStars';
import EmptyState from '@/components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CATEGORIAS = ['Todas', 'Alimentos', 'Ferretería', 'Salud', 'IT', 'Automotriz', 'Embalaje', 'Químicos', 'Oficina', 'Textil'];

export default function PosiblesClientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: myCompany } = useQuery({
    queryKey: ['myCompany', user?.email],
    queryFn: () => base44.entities.Company.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: solicitudes = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const all = await base44.entities.Solicitud.filter({ estado: 'Activo' }, '-created_date');
      return all.filter(s => s.created_by !== user?.email);
    },
    enabled: !!user?.email,
  });

  const filteredSolicitudes = solicitudes.filter(sol => {
    const matchesSearch = sol.producto_servicio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || sol.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetail = (sol) => {
    setSelectedSolicitud(sol);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
          Posibles Clientes
        </h1>
        <p className="text-slate-500 mt-1">
          Encuentra empresas que buscan tus productos o servicios
        </p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Buscar por producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 h-11">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        {isLoading ? (
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </CardContent>
        ) : filteredSolicitudes.length === 0 ? (
          <CardContent className="p-6">
            <EmptyState
              icon={Users}
              title="Sin leads disponibles"
              description={searchTerm || categoryFilter !== 'Todas'
                ? "No se encontraron solicitudes con esos criterios"
                : "Las solicitudes de potenciales clientes aparecerán aquí"}
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-slate-500 font-medium">Producto/Servicio</TableHead>
                  <TableHead className="text-slate-500 font-medium">Cantidad</TableHead>
                  <TableHead className="text-slate-500 font-medium">Categoría</TableHead>
                  <TableHead className="text-slate-500 font-medium">Estado</TableHead>
                  <TableHead className="text-slate-500 font-medium">Fecha</TableHead>
                  <TableHead className="text-slate-500 font-medium">Fecha Límite</TableHead>
                  <TableHead className="text-slate-500 font-medium text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSolicitudes.map((sol) => (
                  <TableRow key={sol.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <p className="font-semibold text-[#1E293B]">
                        {sol.producto_servicio}
                      </p>
                      {sol.descripcion && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {sol.descripcion}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        {sol.cantidad} {sol.unidad_medida}
                      </div>
                    </TableCell>
                    <TableCell>
                      {sol.categoria ? (
                        <Badge variant="secondary" className="text-xs">
                          {sol.categoria}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={sol.estado} />
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {format(new Date(sol.created_date), "d MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      {sol.fecha_vencimiento ? (
                        <div className="flex items-center gap-1 text-amber-600 text-sm">
                          <Clock className="w-4 h-4" />
                          {format(new Date(sol.fecha_vencimiento), "d MMM", { locale: es })}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(sol)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Link to={createPageUrl('Chat') + `?cliente=${sol.created_by}`}>
                          <Button size="sm" className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Negociar
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud</DialogTitle>
          </DialogHeader>
          {selectedSolicitud && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl text-[#1E293B]">
                  {selectedSolicitud.producto_servicio}
                </h3>
                <StatusBadge status={selectedSolicitud.estado} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Cantidad</p>
                  <p className="font-semibold text-[#1E293B]">
                    {selectedSolicitud.cantidad} {selectedSolicitud.unidad_medida}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Categoría</p>
                  <p className="font-semibold text-[#1E293B]">
                    {selectedSolicitud.categoria || 'General'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Fecha de Solicitud</p>
                  <p className="font-semibold text-[#1E293B]">
                    {format(new Date(selectedSolicitud.created_date), "d MMMM yyyy", { locale: es })}
                  </p>
                </div>
                {selectedSolicitud.fecha_vencimiento && (
                  <div className="bg-amber-50 p-4 rounded-xl">
                    <p className="text-sm text-amber-600">Fecha Límite</p>
                    <p className="font-semibold text-amber-700">
                      {format(new Date(selectedSolicitud.fecha_vencimiento), "d MMMM yyyy", { locale: es })}
                    </p>
                  </div>
                )}
              </div>

              {selectedSolicitud.descripcion && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Descripción</p>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-xl">
                    {selectedSolicitud.descripcion}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDetailModalOpen(false)}
                >
                  Cerrar
                </Button>
                <Link to={createPageUrl('Chat') + `?cliente=${selectedSolicitud.created_by}`} className="flex-1">
                  <Button className="w-full bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contactar Cliente
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
