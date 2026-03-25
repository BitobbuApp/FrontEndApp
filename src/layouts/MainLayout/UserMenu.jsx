import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LogOut, User, Lock, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserMenu({ user, myCompany }) {
    const { logout } = useAuth();

    // Helper to get initials and full name fallback
    const userFullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Usuario';
    const displayName = myCompany?.trade_name || userFullName;
    const initial = (myCompany?.trade_name?.[0] || user?.first_name?.[0] || 'U').toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={myCompany?.logo_url} />
                        <AvatarFallback className="bg-[#D2FC31] text-slate-900 text-sm font-medium">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                        {displayName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="p-3 border-b">
                    <p className="text-sm font-medium">
                        {displayName}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                    <Link
                        to={createPageUrl('Perfil')}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <User className="w-4 h-4" />
                        Mi Perfil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        to={createPageUrl('Configuracion') + '?tab=seguridad'}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Lock className="w-4 h-4" />
                        Cambiar Contraseña
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        to={createPageUrl('Configuracion')}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Settings className="w-4 h-4" />
                        Configuración
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 cursor-pointer"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
