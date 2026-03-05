import React from 'react';
import { Bell, HelpCircle, Menu } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';
import { MENU_ITEMS } from './Sidebar';

export default function TopNavbar({
    currentPageName,
    notifications,
    unreadCount,
    user,
    myCompany,
    onOpenSidebar,
}) {
    return (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between px-4 lg:px-8 h-16">
                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onOpenSidebar}
                >
                    <Menu className="w-5 h-5" />
                </Button>

                {/* Page Title */}
                <h1 className="text-lg font-semibold text-[#1E293B] hidden lg:block">
                    {MENU_ITEMS.find((item) => item.page === currentPageName)?.name ||
                        currentPageName}
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
                                            await base44.entities.Notificacion.update(notif.id, {
                                                leida: true,
                                            });
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
                    <UserMenu user={user} myCompany={myCompany} />
                </div>
            </div>
        </header>
    );
}
