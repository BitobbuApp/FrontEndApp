import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LogOut, User, Lock, Settings, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
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
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={myCompany?.logo_url} />
                        <AvatarFallback className="bg-[#D2FC31] text-[#1E293B] text-sm font-medium">
                            {myCompany?.nombre_comercial?.[0] || user?.full_name?.[0] || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                        {myCompany?.nombre_comercial || user?.full_name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="p-3 border-b">
                    <p className="text-sm font-medium">
                        {myCompany?.nombre_comercial || user?.full_name}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                    <Link
                        to={createPageUrl('Configuracion')}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <User className="w-4 h-4" />
                        Editar Perfil
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
                    onClick={() => base44.auth.logout()}
                    className="text-red-600 cursor-pointer"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
