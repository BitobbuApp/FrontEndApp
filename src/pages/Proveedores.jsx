import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Store,
  Search,
  Filter,
  MapPin,
  Star,
  MessageSquare,
  Eye,
  BadgeCheck,
  Building2,
  Globe,
  Package
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
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const SECTORES = ['Todos', 'Alimentos', 'Ferretería', 'Salud', 'IT', 'Automotriz', 'Embalaje', 'Químicos', 'Oficina', 'Textil', 'Logística', 'Mantenimiento', 'Seguridad', 'Marketing', 'Legal', 'RRHH'];
const PLANES = ['Todos', 'Premium', 'Gratuito'];
const RATINGS = ['Todos', '4+ Estrellas', '3+ Estrellas'];

export default function Proveedores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('Todos');
  const [planFilter, setPlanFilter] = useState('Todos');
  const [ratingFilter, setRatingFilter] = useState('Todos');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: proveedores = [], isLoading } = useQuery({
    queryKey: ['proveedores'],
    queryFn: async () => {
      const companies = await base44.entities.Company.filter({ 
        interes: 'Vender' 
      }, '-calificacion_promedio');
      const both = await base44.entities.Company.filter({ 
        interes: 'Ambos' 
      }, '-calificacion_promedio');
      return [...companies, ...both].filter(c => c.created_by !== user?.email);
    },
    enabled: !!user?.email,
  });

  const filteredProveedores = proveedores.filter(prov => {
    const matchesSearch = 
      prov.nombre_comercial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prov.sector?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'Todos' || prov.sector === sectorFilter;
    const matchesPlan = planFilter === 'Todos' || prov.plan_suscripcion === planFilter;
    
    let matchesRating = true;
    if (ratingFilter === '4+ Estrellas') matchesRating = (prov.calificacion_promedio || 0) >= 4;
    if (ratingFilter === '3+ Estrellas') matchesRating = (prov.calificacion_promedio || 0) >= 3;
    
    return matchesSearch && matchesSector && matchesPlan && matchesRating;
  });

  const handleViewProfile = (prov) => {
    setSelectedProveedor(prov);
    setProfileModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
          Directorio de Proveedores
        </h1>
        <p className="text-slate-500 mt-1">
          Encuentra proveedores confiables para tu negocio
        </p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Buscar proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-40 h-11">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  {SECTORES.map((sector) => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-36 h-11">
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  {PLANES.map((plan) => (
                    <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-36 h-11">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  {RATINGS.map((rating) => (
                    <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Providers Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        {isLoading ? (
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </CardContent>
        ) : filteredProveedores.length === 0 ? (
          <CardContent className="p-6">
            <EmptyState
              icon={Store}
              title="Sin proveedores"
              description={searchTerm || sectorFilter !== 'Todos'
                ? "No se encontraron proveedores con esos criterios"
                : "Los proveedores aparecerán aquí"}
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-slate-500 font-medium">Proveedor</TableHead>
                  <TableHead className="text-slate-500 font-medium">Sector</TableHead>
                  <TableHead className="text-slate-500 font-medium">Tipo</TableHead>
                  <TableHead className="text-slate-500 font-medium">Ubicación</TableHead>
                  <TableHead className="text-slate-500 font-medium">Rating</TableHead>
                  <TableHead className="text-slate-500 font-medium text-center">Transacciones</TableHead>
                  <TableHead className="text-slate-500 font-medium text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProveedores.map((prov) => (
                  <TableRow key={prov.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {prov.logo_url ? (
                            <img 
                              src={prov.logo_url} 
                              alt={prov.nombre_comercial}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-bold text-[#1E293B]">
                              {prov.nombre_comercial?.[0] || 'P'}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-[#1E293B]">
                              {prov.nombre_comercial}
                            </p>
                            {prov.plan_suscripcion === 'Premium' && (
                              <BadgeCheck className="w-4 h-4 text-[#D2FC31]" />
                            )}
                            {prov.badge_fundador && (
                              <Badge variant="outline" className="text-xs">Fundador</Badge>
                            )}
                          </div>
                          {prov.cobertura_nacional && (
                            <div className="flex items-center gap-1 text-emerald-600 text-xs mt-0.5">
                              <Globe className="w-3 h-3" />
                              <span>Nacional</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {prov.sector}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {prov.tipo_empresa || 'Empresa'}
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {[prov.ubicacion_ciudad, prov.ubicacion_estado].filter(Boolean).join(', ') || '-'}
                    </TableCell>
                    <TableCell>
                      <RatingStars rating={prov.calificacion_promedio || 0} size="sm" />
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                        {prov.numero_transacciones || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={createPageUrl('Marketplace') + `?proveedor=${prov.created_by}`}>
                          <Button variant="outline" size="sm">
                            <Package className="w-4 h-4 mr-1" />
                            Catálogo
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(prov)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Perfil
                        </Button>
                        <Link to={createPageUrl('Chat') + `?proveedor=${prov.created_by}`}>
                          <Button size="sm" className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Chat
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

      {/* Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Perfil del Proveedor</DialogTitle>
          </DialogHeader>
          {selectedProveedor && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                  {selectedProveedor.logo_url ? (
                    <img 
                      src={selectedProveedor.logo_url} 
                      alt={selectedProveedor.nombre_comercial}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-[#1E293B]">
                      {selectedProveedor.nombre_comercial?.[0] || 'P'}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xl text-[#1E293B]">
                      {selectedProveedor.nombre_comercial}
                    </h3>
                    {selectedProveedor.plan_suscripcion === 'Premium' && (
                      <Badge className="bg-[#D2FC31] text-[#1E293B]">
                        <BadgeCheck className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <RatingStars rating={selectedProveedor.calificacion_promedio || 0} />
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedProveedor.numero_transacciones || 0} transacciones • {selectedProveedor.numero_resenas || 0} reseñas
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Sector</p>
                  <p className="font-semibold text-[#1E293B]">{selectedProveedor.sector}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Tipo</p>
                  <p className="font-semibold text-[#1E293B]">{selectedProveedor.tipo_empresa || 'Empresa'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Ubicación</p>
                  <p className="font-semibold text-[#1E293B]">
                    {[selectedProveedor.ubicacion_ciudad, selectedProveedor.ubicacion_estado].filter(Boolean).join(', ') || 'No especificada'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Cobertura</p>
                  <p className="font-semibold text-[#1E293B]">
                    {selectedProveedor.cobertura_nacional ? 'Nacional' : 'Local'}
                  </p>
                </div>
              </div>

              {selectedProveedor.bio && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Acerca de</p>
                  <p className="text-slate-700">{selectedProveedor.bio}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setProfileModalOpen(false)}
                >
                  Cerrar
                </Button>
                <Link to={createPageUrl('Chat') + `?proveedor=${selectedProveedor.created_by}`} className="flex-1">
                  <Button className="w-full bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d]">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contactar
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
