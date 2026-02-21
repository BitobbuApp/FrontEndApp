import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  FileText,
  Tag,
  DollarSign,
  Users,
  PiggyBank,
  Plus,
  ArrowRight,
  Eye,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import RatingStars from '@/components/ui/RatingStars';
import EmptyState from '@/components/ui/EmptyState';
import SolicitudModal from '@/components/solicitud/SolicitudModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
  const [solicitudModalOpen, setSolicitudModalOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: solicitudes = [], isLoading: loadingSolicitudes } = useQuery({
    queryKey: ['solicitudes', user?.email],
    queryFn: () => base44.entities.Solicitud.filter({ created_by: user?.email }, '-created_date', 5),
    enabled: !!user?.email,
  });

  const { data: ofertas = [], isLoading: loadingOfertas } = useQuery({
    queryKey: ['ofertas', user?.email],
    queryFn: () => base44.entities.Oferta.filter({ comprador_id: user?.email, estado: 'Pendiente' }, '-created_date', 5),
    enabled: !!user?.email,
  });

  const { data: allSolicitudes = [] } = useQuery({
    queryKey: ['allSolicitudes', user?.email],
    queryFn: () => base44.entities.Solicitud.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: allOfertas = [] } = useQuery({
    queryKey: ['allOfertas', user?.email],
    queryFn: () => base44.entities.Oferta.filter({ comprador_id: user?.email }),
    enabled: !!user?.email,
  });

  const { data: transacciones = [] } = useQuery({
    queryKey: ['transacciones', user?.email],
    queryFn: () => base44.entities.Transaccion.filter({ comprador_id: user?.email, estado: 'Completada' }),
    enabled: !!user?.email,
  });

  const stats = {
    cotizacionesActivas: allSolicitudes.filter(s => s.estado === 'Activo').length,
    ofertasRecibidas: allOfertas.filter(o => o.estado === 'Pendiente').length,
    ventasGeneradas: transacciones.length,
    proveedoresConectados: new Set(allOfertas.map(o => o.proveedor_id)).size,
    ahorroEstimado: transacciones.reduce((acc, t) => acc + (t.monto_total * 0.15), 0),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1E293B]">
            ¡Bienvenido{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-slate-500 mt-1">Aquí tienes un resumen de tu actividad</p>
        </div>
        <Button
          onClick={() => setSolicitudModalOpen(true)}
          className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d] font-semibold px-6 h-12 rounded-xl shadow-lg shadow-[#D2FC31]/25"
        >
          <Plus className="w-5 h-5 mr-2" />
          Solicitar Cotización
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Cotizaciones Activas"
          value={stats.cotizacionesActivas}
          icon={FileText}
          trendValue="+12% este mes"
          trend="up"
        />
        <StatCard
          title="Ofertas Recibidas"
          value={stats.ofertasRecibidas}
          icon={Tag}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Negocios Cerrados"
          value={stats.ventasGeneradas}
          icon={DollarSign}
          bgColor="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Proveedores"
          value={stats.proveedoresConectados}
          icon={Users}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Ahorro Estimado"
          value={`$${stats.ahorroEstimado.toLocaleString()}`}
          icon={PiggyBank}
          bgColor="bg-amber-100"
          iconColor="text-amber-600"
        />
      </motion.div>

      {/* Tables Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Quotations */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-[#1E293B]">
                Cotizaciones Recientes
              </CardTitle>
              <Link
                to={createPageUrl('MisSolicitudes')}
                className="text-sm text-slate-500 hover:text-[#1E293B] flex items-center gap-1"
              >
                Ver todas <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {loadingSolicitudes ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : solicitudes.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Sin solicitudes"
                  description="Crea tu primera solicitud de cotización"
                  actionLabel="Nueva Solicitud"
                  onAction={() => setSolicitudModalOpen(true)}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-slate-500 font-medium">Producto</TableHead>
                      <TableHead className="text-slate-500 font-medium">Estado</TableHead>
                      <TableHead className="text-slate-500 font-medium text-center">Ofertas</TableHead>
                      <TableHead className="text-slate-500 font-medium text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitudes.map((sol) => (
                      <TableRow key={sol.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium text-[#1E293B]">
                          {sol.producto_servicio}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={sol.estado} />
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-medium">
                            {sol.numero_ofertas || 0}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={createPageUrl('MisSolicitudes') + `?id=${sol.id}`}>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#1E293B]">
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Offers of Interest */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-[#1E293B]">
                Ofertas de Interés
              </CardTitle>
              <Link
                to={createPageUrl('Ofertas')}
                className="text-sm text-slate-500 hover:text-[#1E293B] flex items-center gap-1"
              >
                Ver todas <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {loadingOfertas ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : ofertas.length === 0 ? (
                <EmptyState
                  icon={Tag}
                  title="Sin ofertas pendientes"
                  description="Las ofertas de proveedores aparecerán aquí"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-slate-500 font-medium">Proveedor</TableHead>
                      <TableHead className="text-slate-500 font-medium">Producto</TableHead>
                      <TableHead className="text-slate-500 font-medium text-right">Precio</TableHead>
                      <TableHead className="text-slate-500 font-medium text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ofertas.map((oferta) => (
                      <TableRow key={oferta.id} className="hover:bg-slate-50/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#D2FC31] flex items-center justify-center text-sm font-medium text-[#1E293B]">
                              {oferta.proveedor_nombre?.[0] || 'P'}
                            </div>
                            <div>
                              <p className="font-medium text-[#1E293B] text-sm">
                                {oferta.proveedor_nombre || 'Proveedor'}
                              </p>
                              <RatingStars rating={oferta.proveedor_calificacion || 0} size="sm" showValue={false} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {oferta.producto_nombre}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[#1E293B]">
                          ${oferta.precio_unitario?.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={createPageUrl('Ofertas') + `?id=${oferta.id}`}>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#1E293B]">
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Tips */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-[#1E293B] to-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D2FC31] rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#1E293B]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Mejora tu visibilidad
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Actualiza a Premium y destaca en las búsquedas de proveedores
                  </p>
                </div>
              </div>
              <Link to={createPageUrl('Configuracion') + '?tab=suscripcion'}>
                <Button className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d] font-semibold">
                  Conocer más
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <SolicitudModal
        open={solicitudModalOpen}
        onOpenChange={setSolicitudModalOpen}
      />
    </motion.div>
  );
}
