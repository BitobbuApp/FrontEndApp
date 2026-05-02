import { Bell, HelpCircle, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';
import { MENU_ITEMS } from './Sidebar';
import {
    markNotificationRead,
    markAllNotificationsRead,
} from '@/features/notifications/services/notificationsApi';

export default function TopNavbar({
    currentPageName,
    notifications,
    unreadCount,
    user,
    myCompany,
    onOpenSidebar,
}) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const normalizedPageName = currentPageName?.startsWith('prospects/')
        ? 'PosiblesClientes'
        : currentPageName;

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['notifications'] });

    const { mutate: readOne } = useMutation({
        mutationFn: (id) => markNotificationRead(id),
        onSuccess: invalidate,
    });

    const { mutate: readAll } = useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: invalidate,
    });

    const handleNotifClick = (notif) => {
        if (!notif.isRead) readOne(notif.id);
        if (notif.link) navigate(notif.link);
    };

    return (
        <header className="sticky top-0 z-40 bg-background border-b border-border">
            <div className="flex items-center justify-between px-4 lg:px-8 h-16">
                {/* Mobile Logo */}
                <div className="flex lg:hidden items-center">
                    <img src="/favicon.svg" alt="Bitobbu" className="w-8 h-8 object-contain" />
                </div>

                {/* Page Title */}
                <h1 className="text-lg font-semibold text-foreground lg:block">
                    {MENU_ITEMS.find((item) => item.page === normalizedPageName)?.name ||
                        normalizedPageName}
                </h1>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5 text-slate-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            {/* Header */}
                            <div className="flex items-center justify-between px-3 py-2 border-b">
                                <h3 className="font-semibold text-sm">Notificaciones</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); readAll(); }}
                                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5" />
                                        Marcar todas
                                    </button>
                                )}
                            </div>

                            {/* List */}
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center">
                                    <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">Sin notificaciones nuevas</p>
                                </div>
                            ) : (
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.slice(0, 10).map((notif) => (
                                        <DropdownMenuItem
                                            key={notif.id}
                                            className={`px-3 py-2.5 cursor-pointer flex flex-col items-start gap-0.5 ${!notif.isRead ? 'bg-blue-50/60 dark:bg-blue-950/30' : ''}`}
                                            onClick={() => handleNotifClick(notif)}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <p className={`text-sm ${!notif.isRead ? 'font-semibold' : 'font-medium'}`}>
                                                    {notif.title}
                                                </p>
                                                {!notif.isRead && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 ml-2" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {new Date(notif.createdAt).toLocaleString('es-VE', {
                                                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            )}

                            {notifications.length > 10 && (
                                <>
                                    <DropdownMenuSeparator />
                                    <div className="p-2 text-center">
                                        <span className="text-xs text-slate-400">
                                            +{notifications.length - 10} más notificaciones
                                        </span>
                                    </div>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Support */}
                    {/*
                    
                    <Button variant="ghost" size="icon">
                        <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Button>
                    
                    */}

                    {/* User Menu */}
                    <UserMenu user={user} myCompany={myCompany} />
                </div>
            </div>
        </header>
    );
}
