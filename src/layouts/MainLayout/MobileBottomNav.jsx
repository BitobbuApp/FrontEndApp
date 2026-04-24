import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FileText, 
    Users, 
    Store, 
    MessageSquare, 
    Plus,
    Briefcase,
    Settings,
    Menu
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { MENU_ITEMS } from './Sidebar';

export default function MobileBottomNav({ 
    currentPageName, 
    myCompany,
    mensajesCount,
    onOpenSidebar
}) {
    const navigate = useNavigate();
    
    const normalizedPageName = currentPageName?.startsWith('prospects/')
        ? 'PosiblesClientes'
        : currentPageName;

    const isActive = (page) => normalizedPageName === page;

    // Filter items for mobile (limit to 4 or 5)
    // We want: Dashboard, (Requests or Prospects or both), Chat, and the Plus button if buyer
    const filteredItems = MENU_ITEMS.filter(item => {
        const hasBuyerRole = item.roles.includes('buyer') && myCompany?.can_buy;
        const hasSupplierRole = item.roles.includes('supplier') && myCompany?.can_sell;
        return hasBuyerRole || hasSupplierRole;
    });

    // Special handling for the Plus button
    const handlePlusClick = () => {
        navigate(createPageUrl('Requests/new'));
    };

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom,0px)]">
            <div className="flex items-center justify-around h-16 px-2">
                {filteredItems.map((item, index) => {
                    const isIconActive = isActive(item.page);
                    
                    // Logic to insert the Plus button in the "middle" for buyers
                    // In a list of 4, the middle is between 2 and 3.
                    // If we have Dashboard, Requests, Chat, and let's say "Proveedores" or "Prospects"
                    // Let's just manually construct the list for better UX on mobile
                    return null; // We'll reconstruct below
                })}

                {/* Manual Reconstruction for best Mobile UX */}
                
                {/* 1. Dashboard */}
                <NavLink 
                    to="Dashboard" 
                    icon={LayoutDashboard} 
                    isActive={isActive('Dashboard')} 
                />

                {/* 2. Principal Action */}
                {myCompany?.can_buy ? (
                    <NavLink 
                        to="Requests" 
                        icon={FileText} 
                        isActive={isActive('Requests')} 
                    />
                ) : myCompany?.can_sell ? (
                    <NavLink 
                        to="PosiblesClientes" 
                        icon={Briefcase} 
                        isActive={isActive('PosiblesClientes')} 
                    />
                ) : null}

                {/* 3. CENTER PLUS BUTTON (If Buyer) */}
                {myCompany?.can_buy && (
                    <div className="flex flex-col items-center justify-center -mt-8">
                        <button 
                            onClick={handlePlusClick}
                            className="w-14 h-14 bg-[#D2FC31] text-slate-900 rounded-full shadow-lg shadow-[#D2FC31]/40 flex items-center justify-center border-4 border-background transition-transform active:scale-90"
                        >
                            <Plus className="w-7 h-7" />
                        </button>
                    </div>
                )}

                {/* 4. Chat */}
                <NavLink 
                    to="Chat" 
                    icon={MessageSquare} 
                    isActive={isActive('Chat')} 
                    badge={mensajesCount}
                />

                {/* 5. Secondary Option */}
                {myCompany?.can_buy && myCompany?.can_sell ? (
                    <button 
                        onClick={onOpenSidebar}
                        className="flex flex-col items-center justify-center flex-1 h-full text-slate-400"
                    >
                        <div className="p-1.5 rounded-xl transition-all">
                            <Menu className="w-6 h-6" />
                        </div>
                    </button>
                ) : myCompany?.can_buy ? (
                    <NavLink 
                        to="Proveedores" 
                        icon={Store} 
                        isActive={isActive('Proveedores')} 
                    />
                ) : null}
            </div>
        </div>
    );
}

function NavLink({ to, icon: Icon, isActive, badge }) {
    return (
        <Link 
            to={createPageUrl(to)}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive ? 'text-slate-900' : 'text-slate-400'
            }`}
        >
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#D2FC31]' : ''}`}>
                <Icon className="w-6 h-6" />
            </div>
            {badge > 0 && (
                <span className="absolute top-3 right-1/2 translate-x-4 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[1rem] px-1 flex items-center justify-center border-2 border-background">
                    {badge}
                </span>
            )}
        </Link>
    );
}
