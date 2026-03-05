import React, { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import useLayoutData from './useLayoutData';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function MainLayout({ children, currentPageName }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-slate-200">
                <Sidebar {...sidebarProps} onClose={() => { }} />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <Sidebar {...sidebarProps} onClose={() => setSidebarOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="lg:pl-64">
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
