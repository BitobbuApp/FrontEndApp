import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Grid, Package, Users, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/AuthContext';
import UserMenu from '../MainLayout/UserMenu';
import { createPageUrl } from '@/utils';

export default function PublicHeader({
    user,
    myCompany,
    onRequireAuth,
}) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleActionClick = (action) => {
        if (!isAuthenticated) {
            onRequireAuth();
        } else {
            if (action === 'quote') {
                navigate(createPageUrl('Requests/new'));
            }
        }
    };

    return (
        <header className="w-full bg-white border-b border-slate-200">
            {/* Top Bar */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex flex-shrink-0 items-center gap-2">
                        <div className="w-10 h-10 bg-[#D2FC31] rounded-lg flex items-center justify-center">
                            <span className="font-extrabold text-2xl text-[#0B2046]">B</span>
                        </div>
                        <span className="font-bold text-2xl text-[#0B2046] tracking-tight hidden sm:block">Bitobbu</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl hidden md:flex items-center">
                        <div className="relative w-full flex">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Buscar productos o proveedores..."
                                className="w-full pl-10 pr-24 h-12 bg-white border-slate-300 rounded-lg text-base rounded-r-none focus-visible:ring-0 focus-visible:border-[#0B2046]"
                            />
                            <Button className="h-12 px-6 bg-[#0B2046] hover:bg-[#16305a] text-white rounded-l-none font-semibold">
                                Buscar
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => handleActionClick('quote')}
                            className="hidden lg:flex bg-[#D2FC31] hover:bg-[#c4ed2d] text-[#0B2046] font-bold h-10 px-4"
                        >
                            + Solicitar Cotización
                        </Button>

                        {isAuthenticated ? (
                            <div className="ml-2">
                                <UserMenu user={user} myCompany={myCompany} />
                            </div>
                        ) : (
                            <>
                                <button onClick={() => onRequireAuth()}>
                                    <Button variant="ghost" className="hidden sm:flex font-semibold text-slate-700 hover:text-[#0B2046]">
                                        Inicia Sesión
                                    </Button>
                                </button>
                                <Link to="/register">
                                    <Button variant="outline" className="hidden sm:flex border-[#0B2046] text-[#0B2046] font-semibold hover:bg-slate-50">
                                        Regístrate Gratis
                                    </Button>
                                </Link>
                            </>
                        )}
                        
                        {/* Mobile Menu Button */}
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6 text-slate-700" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sub-nav */}
            <div className="border-t border-slate-100 hidden md:block">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 text-sm font-medium text-slate-600">
                        <div className="flex items-center gap-8">
                            <button className="flex items-center gap-2 text-[#0B2046] hover:text-[#0B2046]/80 group">
                                <Grid className="w-4 h-4" />
                                <span>Todas las categorías</span>
                                <span className="text-xs ml-1 group-hover:rotate-180 transition-transform">▼</span>
                            </button>
                            <nav className="flex items-center gap-6">
                                <button 
                                    onClick={() => document.getElementById('productos-section')?.scrollIntoView({ behavior: 'smooth' })} 
                                    className="flex items-center gap-2 hover:text-[#0B2046] transition-colors"
                                >
                                    <Package className="w-4 h-4" />
                                    <span>Productos</span>
                                </button>
                                <Link to="/" className="flex items-center gap-2 hover:text-[#0B2046] transition-colors">
                                    <Users className="w-4 h-4" />
                                    <span>Proveedores</span>
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link to="/" className="hover:text-[#0B2046] transition-colors">Vender en Bitobbu</Link>
                            <Link to="/" className="hover:text-[#0B2046] transition-colors">Cómo funciona</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
