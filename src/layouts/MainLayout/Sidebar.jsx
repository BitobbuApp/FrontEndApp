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
    Plus,
    ShieldCheck,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MENU_ITEMS = [
    { name: 'Resumen', icon: LayoutDashboard, page: 'Dashboard', roles: ['buyer', 'supplier'] },
    { name: 'Mis Solicitudes', icon: FileText, page: 'Requests', roles: ['buyer'] },
    { name: 'Posibles Clientes', icon: Users, page: 'PosiblesClientes', roles: ['supplier'] },
    { name: 'Proveedores', icon: Store, page: 'Proveedores', roles: ['buyer'] },
    { name: 'Chat', icon: MessageSquare, page: 'Chat', roles: ['buyer', 'supplier'] },
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

    let trustScore = 0;
    if (myCompany) {
        if (myCompany.verification_info?.status === 'verified' || myCompany.is_verified) trustScore += 40;
        if (myCompany.logo_url) trustScore += 10;
        if (myCompany.trade_name || myCompany.nombre_comercial) trustScore += 5;
        if (myCompany.sector) trustScore += 5;
        if (myCompany.company_type || myCompany.tipo_empresa) trustScore += 5;
        if (myCompany.locations?.length > 0) trustScore += 5;
        if (myCompany.bio) trustScore += 5;
        if (myCompany.founding_year) trustScore += 5;
        if (myCompany.contacts?.length > 0 && (myCompany.contacts[0].whatsapp || myCompany.contacts[0].corporate_email)) trustScore += 10;
        if (myCompany.payment_methods?.length > 0) trustScore += 5;
        if (myCompany.website || myCompany.linkedin || myCompany.instagram) trustScore += 5;
    }

    const filteredItems = MENU_ITEMS.filter(item => {
        const hasBuyerRole = item.roles.includes('buyer') && myCompany?.can_buy;
        const hasSupplierRole = item.roles.includes('supplier') && myCompany?.can_sell;
        return hasBuyerRole || hasSupplierRole;
    });

    return (
        <div className="flex flex-col h-full relative">
            {/* Collapse toggle button — only visible on desktop */}
            {onToggleCollapse && (
                <button
                    onClick={onToggleCollapse}
                    className="hidden lg:flex absolute -right-8 top-12 z-20 w-8 h-8 bg-background border border-border rounded-full items-center justify-center shadow-md hover:bg-accent transition-all duration-300"
                    title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
                >
                    {collapsed
                        ? <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        : <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                    }
                </button>
            )}

            {/* Logo */}
            <div className={`border-b border-border transition-all duration-300`}>
                <Link to={createPageUrl('Dashboard')} className="flex items-center justify-center overflow-hidden w-full">
                    <div className={`flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 w-[75%] h-auto py-4`}>
                        <img 
                            src={collapsed ? "/favicon.svg" : "/assets/logo-b.svg"} 
                            alt="Bitobbu" 
                            className="w-full h-full object-contain" 
                        />
                    </div>
                </Link>
            </div>

            {/* Create RFQ Button */}
            {myCompany?.can_buy && (
                <div className={`pt-2 px-2 ${collapsed ? 'flex justify-center' : ''}`}>
                    <Button 
                        asChild
                        className={`w-full bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] shadow-sm font-semibold ${collapsed ? 'w-10 h-10 p-0 rounded-xl' : 'rounded-xl h-10'}`}
                    >
                        <Link to={createPageUrl('Requests/new')} onClick={onClose} title="Crear Solicitud">
                            <Plus className={collapsed ? 'w-5 h-5' : 'w-4 h-4 mr-2'} />
                            {!collapsed && 'Crear Solicitud'}
                        </Link>
                    </Button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                {filteredItems.map((item) => {
                    const badgeCount = getBadgeCount(item.page);

                    return (
                        <Link
                            key={item.page}
                            to={createPageUrl(item.page)}
                            onClick={onClose}
                            title={collapsed ? item.name : undefined}
                            className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
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

            {/* Trust Score & Plan Badge Area */}
            <div className={`border-t border-border transition-all duration-300 ${collapsed ? 'p-2 space-y-2' : 'p-3 space-y-3'}`}>
                
                {/* Trust Score */}
                {!collapsed ? (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                <ShieldCheck className="w-4 h-4 text-[#a8d92a]" />
                                <span className="text-xs font-semibold">Nivel de Confianza</span>
                            </div>
                            <span className="text-xs font-bold">{trustScore}%</span>
                        </div>
                        <Progress value={trustScore} className="h-1.5" />
                    </div>
                ) : (
                    <div className="flex justify-center" title={`Nivel de Confianza: ${trustScore}%`}>
                        <ShieldCheck className={`w-6 h-6 ${trustScore >= 100 ? 'text-[#a8d92a]' : 'text-slate-400'}`} />
                    </div>
                )}
                {collapsed ? (
                    /* Collapsed: clickeable dot */
                    <Link
                        to={createPageUrl('Configuracion') + '?tab=suscripcion'}
                        className="flex justify-center group"
                    >
                        <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105 ${
                                myCompany?.plan_suscripcion === 'Premium'
                                    ? 'bg-amber-100 text-amber-700 shadow-sm'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                            title={myCompany?.plan_suscripcion === 'Premium' ? 'Gestionar Plan Premium' : 'Actualizar a Premium'}
                        >
                            {myCompany?.plan_suscripcion === 'Premium' ? '★' : 'G'}
                        </div>
                    </Link>
                ) : (
                    /* Expanded: clickeable card */
                    <Link
                        to={createPageUrl('Configuracion') + '?tab=suscripcion'}
                        className={`block p-3 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${myCompany?.plan_suscripcion === 'Premium'
                            ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 hover:border-amber-300'
                            : 'bg-muted/50 dark:bg-slate-800 hover:bg-muted border border-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            {myCompany?.plan_suscripcion === 'Premium' ? (
                                <Badge className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm">Premium</Badge>
                            ) : (
                                <Badge variant="secondary">Gratuito</Badge>
                            )}
                            {myCompany?.badge_fundador && (
                                <Badge className="bg-[#1E293B] text-white">Fundador</Badge>
                            )}
                        </div>
                        <span className={`text-xs font-medium block mt-1 ${
                             myCompany?.plan_suscripcion === 'Premium' ? 'text-amber-700' : 'text-slate-500'
                        }`}>
                            {myCompany?.plan_suscripcion === 'Premium' ? 'Gestionar mi plan →' : 'Actualizar a Premium ✨'}
                        </span>
                    </Link>
                )}
            </div>
        </div>
    );
}
