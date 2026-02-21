import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Tag,
  Search,
  Filter,
  Eye,
  X,
  Check,
  MessageSquare,
  Building2,
  Clock,
  Calendar
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import StatusBadge from '@/components/ui/StatusBadge';
import RatingStars from '@/components/ui/RatingStars';
import EmptyState from '@/components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Ofertas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedOferta, setSelectedOferta] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState('todas');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: ofertas = [], isLoading } = useQuery({
    queryKey: ['ofertas', user?.email],
    queryFn: () => base44.entities.Oferta.filter({ comprador_id: user?.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, motivo }) => base44.entities.Oferta.update(id, { 
      estado: 'Rechazada',
      motivo_rechazo: motivo 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ofertas'] });
      toast.success('Oferta rechazada');
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedOferta(null);
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (id) => base44.entities.Oferta.update(id, { estado: 'Aceptada' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ofertas'] });
      toast.success('Oferta aceptada');
    },
  });

  const filteredOfertas = ofertas.filter(oferta => {
    const matchesSearch = 
      oferta.producto_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oferta.proveedor_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'todas') return matchesSearch;
    if (activeTab === 'proactivas') return matchesSearch && oferta.es_proactiva;
    if (activeTab === 'pendientes') return matchesSearch && oferta.estado === 'Pendiente';
    return matchesSearch;
  });

  const handleReject = (oferta) => {
    setSelectedOferta(oferta);
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (selectedOferta) {
      rejectMutation.mutate({ id: selectedOferta.id, motivo: rejectReason });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
          Ofertas
        </h1>
        <p className="text-slate-500 mt-1">
          Revisa y gestiona las ofertas de proveedores
        </p>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="proactivas">Anuncios</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Buscar ofertas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Offers Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        {isLoading ? (
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </CardContent>
        ) : filteredOfertas.length === 0 ? (
          <CardContent className="p-6">
            <EmptyState
              icon={Tag}
              title="Sin ofertas"
              description={searchTerm 
                ? "No se encontraron ofertas con esos criterios" 
                : "Las ofertas de proveedores aparecerán aquí"}
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-slate-500 font-medium">Proveedor</TableHead>
                  <TableHead className="text-slate-500 font-medium">Producto</TableHead>
                  <TableHead className="text-slate-500 font-medium">Tipo</TableHead>
                  <TableHead className="text-slate-500 font-medium">Precio Unit.</TableHead>
                  <TableHead className="text-slate-500 font-medium">Precio Total</TableHead>
                  <TableHead className="text-slate-500 font-medium">Condiciones</TableHead>
                  <TableHead className="text-slate-500 font-medium">Estado</TableHead>
                  <TableHead className="text-slate-500 font-medium text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfertas.map((oferta) => (
                  <TableRow key={oferta.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#D2FC31] flex items-center justify-center text-sm font-bold text-[#1E293B] flex-shrink-0">
                          {oferta.proveedor_nombre?.[0] || 'P'}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1E293B]">
                            {oferta.proveedor_nombre || 'Proveedor'}
                          </p>
                          <RatingStars rating={oferta.proveedor_calificacion || 0} size="sm" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#1E293B]">{oferta.producto_nombre}</p>
                        <p className="text-xs text-slate-500">{oferta.cantidad} unidades</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {oferta.es_proactiva ? (
                        <Badge className="bg-purple-100 text-purple-700">Anuncio</Badge>
                      ) : (
                        <Badge variant="secondary">Solicitud</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-[#1E293B]">
                      ${oferta.precio_unitario?.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold text-[#1E293B]">
                      ${(oferta.precio_unitario * oferta.cantidad)?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Clock className="w-3 h-3" />
                          {oferta.condiciones_pago}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Calendar className="w-3 h-3" />
                          {oferta.tiempo_entrega}
                        </div>
                        <p className="text-xs text-amber-600">
                          Válida hasta {format(new Date(oferta.created_date).setDate(new Date(oferta.created_date).getDate() + 15), "d/M", { locale: es })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={oferta.estado} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {oferta.estado === 'Pendiente' ? (
                          <>
                            <Link to={createPageUrl('Chat') + `?proveedor=${oferta.proveedor_id}`}>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Negociar
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]"
                              onClick={() => acceptMutation.mutate(oferta.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Aceptar
                            </Button>
                          </>
                        ) : (
                          <Button variant="ghost" size="sm" disabled>
                            {oferta.estado}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Oferta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-600">
              ¿Por qué rechazas esta oferta? (opcional)
            </p>
            <Textarea
              placeholder="Escribe el motivo del rechazo..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmReject}
              disabled={rejectMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
