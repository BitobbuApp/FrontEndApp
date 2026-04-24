import { Bell, HelpCircle, Menu } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';
import { ThemeToggle } from '@/components/theme-toggle';
import { MENU_ITEMS } from './Sidebar';

export default function TopNavbar({
    currentPageName,
    notifications,
    unreadCount,
    user,
    myCompany,
    onOpenSidebar,
}) {
    const normalizedPageName = currentPageName?.startsWith('prospects/')
        ? 'PosiblesClientes'
        : currentPageName;

    return (
        <header className="sticky top-0 z-40 bg-background border-b border-border">
            <div className="flex items-center justify-between px-4 lg:px-8 h-16">
                {/* Mobile Logo */}
                <div className="flex lg:hidden items-center gap-2">
                    <div className="w-8 h-8 bg-[#D2FC31] rounded-lg flex items-center justify-center">
                        <span className="text-foreground font-bold text-sm">B</span>
                    </div>
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
                                        onClick={() => {
                                            // TODO: Mark as read when notifications API is ready
                                            if (notif.link) {
                                                window.location.href = notif.link;
                                            }
                                        }}
                                    >
                                        <div>
                                            <p className="text-sm font-medium">{notif.title}</p>
                                            <p className="text-xs text-slate-500">{notif.message}</p>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Support */}
                    <Button variant="ghost" size="icon">
                        <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* User Menu */}
                    <UserMenu user={user} myCompany={myCompany} />
                </div>
            </div>
        </header>
    );
}
