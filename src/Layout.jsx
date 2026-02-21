import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  FileText,
  Tag,
  Users,
  Store,
  ShoppingBag,
  MessageSquare,
  Settings,
  Bell,
  HelpCircle,
  ChevronDown,
  LogOut,
  User,
  Lock,
  Menu,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: company } = useQuery({
    queryKey: ['myCompany', user?.email],
    queryFn: () => base44.entities.Company.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: () => base44.entities.Notificacion.filter({ usuario_id: user?.email, leida: false }),
    enabled: !!user?.email,
    refetchInterval: 10000,
  });

  const { data: solicitudesCount = 0 } = useQuery({
    queryKey: ['solicitudesCount', user?.email],
    queryFn: async () => {
      const sols = await base44.entities.Solicitud.filter({ created_by: user?.email, estado: 'Activo' });
      return sols.length;
    },
    enabled: !!user?.email,
  });

  const { data: ofertasCount = 0 } = useQuery({
    queryKey: ['ofertasCount', user?.email],
    queryFn: async () => {
      const offs = await base44.entities.Oferta.filter({ comprador_id: user?.email, estado: 'Pendiente' });
      return offs.length;
    },
    enabled: !!user?.email,
  });

  const { data: mensajesCount = 0 } = useQuery({
    queryKey: ['mensajesCount', user?.email],
    queryFn: async () => {
      const convs = await base44.entities.Conversacion.list();
      const myConvs = convs.filter(c => 
        c.participante_1_id === user?.email || c.participante_2_id === user?.email
      );
      return myConvs.reduce((acc, c) => {
        if (c.participante_1_id === user?.email) return acc + (c.mensajes_no_leidos_1 || 0);
        return acc + (c.mensajes_no_leidos_2 || 0);
      }, 0);
    },
    enabled: !!user?.email,
  });

  const myCompany = company?.[0];
  const unreadCount = notifications.length;

  const menuItems = [
    { name: 'Resumen', icon: LayoutDashboard, page: 'Dashboard' },
    { name: 'Mis Solicitudes', icon: FileText, page: 'MisSolicitudes' },
    { name: 'Ofertas', icon: Tag, page: 'Ofertas' },
    { name: 'Posibles Clientes', icon: Users, page: 'PosiblesClientes' },
    { name: 'Proveedores', icon: Store, page: 'Proveedores' },
    { name: 'Marketplace', icon: ShoppingBag, page: 'Marketplace' },
    { name: 'Chat', icon: MessageSquare, page: 'Chat' },
  ];

  const isActive = (page) => currentPageName === page;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#D2FC31] rounded-xl flex items-center justify-center">
            <span className="text-[#1E293B] font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-[#1E293B]">Bitobbu</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          let badgeCount = 0;
          if (item.page === 'MisSolicitudes') badgeCount = solicitudesCount;
          if (item.page === 'Ofertas') badgeCount = ofertasCount;
          if (item.page === 'Chat') badgeCount = mensajesCount;

          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                isActive(item.page)
                  ? 'bg-[#D2FC31] text-[#1E293B]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#1E293B]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
              {badgeCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Plan Badge */}
      <div className="p-4 border-t border-slate-100">
        <div className={`p-4 rounded-xl ${myCompany?.plan_suscripcion === 'Premium' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            {myCompany?.plan_suscripcion === 'Premium' ? (
              <Badge className="bg-amber-500 text-white">Premium</Badge>
            ) : (
              <Badge variant="secondary">Gratuito</Badge>
            )}
            {myCompany?.badge_fundador && (
              <Badge className="bg-[#1E293B] text-white">Fundador</Badge>
            )}
          </div>
          {myCompany?.plan_suscripcion !== 'Premium' && (
            <Link 
              to={createPageUrl('Configuracion') + '?tab=suscripcion'}
              className="text-xs text-[#1E293B] font-medium hover:underline"
            >
              Actualizar a Premium →
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-slate-200">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Page Title */}
            <h1 className="text-lg font-semibold text-[#1E293B] hidden lg:block">
              {menuItems.find(item => item.page === currentPageName)?.name || currentPageName}
            </h1>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-3 border-b">
                    <h3 className="font-semibold">Notificaciones</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No tienes notificaciones nuevas
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <DropdownMenuItem 
                        key={notif.id} 
                        className="p-3 cursor-pointer"
                        onClick={async () => {
                          await base44.entities.Notificacion.update(notif.id, { leida: true });
                          if (notif.enlace) {
                            window.location.href = notif.enlace;
                          }
                        }}
                      >
                        <div>
                          <p className="text-sm font-medium">{notif.titulo}</p>
                          <p className="text-xs text-slate-500">{notif.mensaje}</p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Support */}
              <Button variant="ghost" size="icon">
                <HelpCircle className="w-5 h-5 text-slate-600" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={myCompany?.logo_url} />
                      <AvatarFallback className="bg-[#D2FC31] text-[#1E293B] text-sm font-medium">
                        {myCompany?.nombre_comercial?.[0] || user?.full_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                      {myCompany?.nombre_comercial || user?.full_name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium">{myCompany?.nombre_comercial || user?.full_name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('Configuracion')} className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      Editar Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('Configuracion') + '?tab=seguridad'} className="flex items-center gap-2 cursor-pointer">
                      <Lock className="w-4 h-4" />
                      Cambiar Contraseña
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('Configuracion')} className="flex items-center gap-2 cursor-pointer">
                      <Settings className="w-4 h-4" />
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => base44.auth.logout()}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
