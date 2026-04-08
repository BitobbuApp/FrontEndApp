import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
    LayoutDashboard,
    FileText,
    Users,
    Store,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MENU_ITEMS = [
    { name: 'Resumen', icon: LayoutDashboard, page: 'Dashboard' },
    { name: 'Mis Solicitudes', icon: FileText, page: 'Requests' },
    // { name: 'Ofertas', icon: Tag, page: 'Offers' },
    { name: 'Posibles Clientes', icon: Users, page: 'PosiblesClientes' },
    { name: 'Proveedores', icon: Store, page: 'Proveedores' },
    // { name: 'Marketplace', icon: ShoppingBag, page: 'Marketplace' },
    { name: 'Chat', icon: MessageSquare, page: 'Chat' },
];

export { MENU_ITEMS };

export default function Sidebar({
    currentPageName,
    solicitudesCount,
    ofertasCount,
    mensajesCount,
    myCompany,
    onClose,
    collapsed = false,
    onToggleCollapse,
}) {
    const normalizedPageName = currentPageName?.startsWith('prospects/')
        ? 'PosiblesClientes'
        : currentPageName;

    const isActive = (page) => normalizedPageName === page;

    const getBadgeCount = (page) => {
        if (page === 'Requests') return solicitudesCount;
        if (page === 'Offers') return ofertasCount;
        if (page === 'Chat') return mensajesCount;
        return 0;
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Collapse toggle button — only visible on desktop */}
            {onToggleCollapse && (
                <button
                    onClick={onToggleCollapse}
                    className="hidden lg:flex absolute -right-3.5 top-7 z-20 w-7 h-7 bg-background border border-border rounded-full items-center justify-center shadow-sm hover:bg-accent transition-colors"
                    title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
                >
                    {collapsed
                        ? <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        : <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                    }
                </button>
            )}

            {/* Logo */}
            <div className={`border-b border-border transition-all duration-300 ${collapsed ? 'p-4' : 'p-6'}`}>
                <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2 overflow-hidden">
                    <div className="w-10 h-10 bg-[#D2FC31] rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-foreground font-bold text-lg">B</span>
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold text-foreground whitespace-nowrap">Bitobbu</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {MENU_ITEMS.map((item) => {
                    const badgeCount = getBadgeCount(item.page);

                    return (
                        <Link
                            key={item.page}
                            to={createPageUrl(item.page)}
                            onClick={onClose}
                            title={collapsed ? item.name : undefined}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                                collapsed ? 'justify-center' : ''
                            } ${isActive(item.page)
                                ? 'bg-[#D2FC31] text-slate-900'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-accent hover:text-accent-foreground'
                            }`}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && (
                                <span className="flex-1 whitespace-nowrap">{item.name}</span>
                            )}
                            {!collapsed && badgeCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {badgeCount}
                                </span>
                            )}
                            {collapsed && badgeCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {badgeCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Plan Badge */}
            <div className={`border-t border-border transition-all duration-300 ${collapsed ? 'p-3' : 'p-4'}`}>
                {collapsed ? (
                    /* Collapsed: just show the plan dot */
                    <div className="flex justify-center">
                        <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                                myCompany?.plan_suscripcion === 'Premium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-500'
                            }`}
                            title={myCompany?.plan_suscripcion === 'Premium' ? 'Plan Premium' : 'Plan Gratuito'}
                        >
                            {myCompany?.plan_suscripcion === 'Premium' ? '★' : 'G'}
                        </div>
                    </div>
                ) : (
                    <div className={`p-4 rounded-xl ${myCompany?.plan_suscripcion === 'Premium'
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
                        : 'bg-muted/50 dark:bg-slate-800'
                        }`}
                    >
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
                                className="text-xs text-foreground font-medium hover:underline"
                            >
                                Actualizar a Premium →
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
