import React, { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import useLayoutData from './useLayoutData';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const SIDEBAR_EXPANDED_W = 'w-64';
const SIDEBAR_COLLAPSED_W = 'w-[68px]';

export default function MainLayout({ children, currentPageName }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const {
        user,
        myCompany,
        notifications,
        unreadCount,
        solicitudesCount,
        ofertasCount,
        mensajesCount,
    } = useLayoutData();

    const sidebarProps = {
        currentPageName,
        solicitudesCount,
        ofertasCount,
        mensajesCount,
        myCompany,
    };

    const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W;
    const contentPadding = collapsed ? 'lg:pl-[68px]' : 'lg:pl-64';

    return (
        <div className="min-h-screen bg-muted/50 dark:bg-slate-950">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-background border-r border-border transition-all duration-300 overflow-visible ${sidebarWidth}`}
            >
                <Sidebar
                    {...sidebarProps}
                    onClose={() => { }}
                    collapsed={collapsed}
                    onToggleCollapse={() => setCollapsed((c) => !c)}
                />
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <Sidebar {...sidebarProps} onClose={() => setSidebarOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${contentPadding}`}>
                <TopNavbar
                    currentPageName={currentPageName}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    user={user}
                    myCompany={myCompany}
                    onOpenSidebar={() => setSidebarOpen(true)}
                />

                {/* Page Content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
