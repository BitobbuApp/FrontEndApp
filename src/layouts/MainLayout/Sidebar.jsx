import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
    LayoutDashboard,
    FileText,
    Tag,
    Users,
    Store,
    ShoppingBag,
    MessageSquare,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MENU_ITEMS = [
    { name: 'Resumen', icon: LayoutDashboard, page: 'Dashboard' },
    { name: 'Mis Solicitudes', icon: FileText, page: 'Requests' },
    { name: 'Ofertas', icon: Tag, page: 'Offers' },
    { name: 'Posibles Clientes', icon: Users, page: 'PosiblesClientes' },
    { name: 'Proveedores', icon: Store, page: 'Proveedores' },
    { name: 'Marketplace', icon: ShoppingBag, page: 'Marketplace' },
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
}) {
    const isActive = (page) => currentPageName === page;

    const getBadgeCount = (page) => {
        if (page === 'Requests') return solicitudesCount;
        if (page === 'Offers') return ofertasCount;
        if (page === 'Chat') return mensajesCount;
        return 0;
    };

    return (
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
                {MENU_ITEMS.map((item) => {
                    const badgeCount = getBadgeCount(item.page);

                    return (
                        <Link
                            key={item.page}
                            to={createPageUrl(item.page)}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${isActive(item.page)
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
                <div
                    className={`p-4 rounded-xl ${myCompany?.plan_suscripcion === 'Premium'
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
                        : 'bg-slate-50'
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
                            className="text-xs text-[#1E293B] font-medium hover:underline"
                        >
                            Actualizar a Premium →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
