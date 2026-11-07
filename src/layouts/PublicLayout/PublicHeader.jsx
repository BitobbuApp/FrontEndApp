import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Grid, Package, Menu, HelpCircle, Store, LogIn, UserPlus, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useAuth } from '@/features/auth/AuthContext';
import UserMenu from '../MainLayout/UserMenu';
import { createPageUrl } from '@/utils';

const scrollToId = (...ids) => {
    const target = ids.map((id) => document.getElementById(id)).find(Boolean);
    target?.scrollIntoView({ behavior: 'smooth' });
};

export default function PublicHeader({
    user,
    myCompany,
    onRequireAuth,
}) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleActionClick = (action) => {
        if (!isAuthenticated) {
            onRequireAuth();
        } else {
            if (action === 'quote') {
                navigate(createPageUrl('Requests/new'));
            }
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const term = searchTerm.trim();
        navigate(term ? `/?q=${encodeURIComponent(term)}` : '/');
        setTimeout(() => scrollToId('productos-section'), 0);
    };

    // Close the drawer first so the page can scroll / the auth modal can take focus
    const fromMenu = (action) => () => {
        setMenuOpen(false);
        setTimeout(action, 150);
    };

    const goToCategories = () => scrollToId('hero-categorias', 'productos-section');
    const goToProducts = () => scrollToId('productos-section');
    const goToHowItWorks = () => scrollToId('como-funciona', 'productos-section');

    const searchForm = (
        <form onSubmit={handleSearch} className="relative w-full flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar productos o proveedores..."
                aria-label="Buscar productos o proveedores"
                className="w-full min-w-0 pl-10 h-11 sm:h-12 bg-white border-slate-300 rounded-lg text-base rounded-r-none focus-visible:ring-0 focus-visible:border-[#0B2046]"
            />
            <Button type="submit" className="h-11 sm:h-12 px-3 sm:px-6 flex-shrink-0 bg-[#0B2046] hover:bg-[#16305a] text-white rounded-l-none font-semibold">
                Buscar
            </Button>
        </form>
    );

    const menuItemClass = 'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50';

    return (
        <header className="w-full bg-white border-b border-slate-200">
            {/* Top Bar */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex min-w-0 flex-shrink-0 items-center" aria-label="Bitobbu">
                        <img src="/assets/logo-b.svg" alt="Bitobbu" className="h-8 sm:h-10 w-auto object-contain" />
                    </Link>

                    {/* Search Bar (desktop) */}
                    <div className="flex-1 max-w-2xl hidden lg:flex items-center">
                        {searchForm}
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
                                <Button
                                    variant="ghost"
                                    onClick={() => onRequireAuth()}
                                    className="hidden lg:flex font-semibold text-slate-700 hover:text-[#0B2046]"
                                >
                                    Inicia Sesión
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="hidden sm:flex border-[#0B2046] text-[#0B2046] font-semibold hover:bg-slate-50"
                                >
                                    <Link to="/register">Regístrate Gratis</Link>
                                </Button>
                            </>
                        )}

                        {/* Mobile / tablet menu */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            aria-label="Abrir menú"
                            onClick={() => setMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6 text-slate-700" />
                        </Button>
                    </div>
                </div>

                {/* Search Bar (below lg: own row, full width) */}
                <div className="lg:hidden pb-3">{searchForm}</div>
            </div>

            {/* Sub-nav */}
            <div className="border-t border-slate-100 hidden lg:block">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 text-sm font-medium text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-8">
                            <button
                                onClick={goToCategories}
                                className="flex items-center gap-2 text-[#0B2046] hover:text-[#0B2046]/80"
                            >
                                <Grid className="w-4 h-4" />
                                <span>Todas las categorías</span>
                            </button>
                            <button
                                onClick={goToProducts}
                                className="flex items-center gap-2 hover:text-[#0B2046] transition-colors"
                            >
                                <Package className="w-4 h-4" />
                                <span>Productos</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-6">
                            <a
                                href="https://vender.bitobbu.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#0B2046] transition-colors"
                            >
                                Vender en Bitobbu
                            </a>
                            <button onClick={goToHowItWorks} className="hover:text-[#0B2046] transition-colors">
                                Cómo funciona
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Drawer for mobile / tablet */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetContent side="right" className="w-4/5 max-w-xs p-0 overflow-y-auto">
                    <SheetHeader className="border-b border-slate-100 p-5 text-left">
                        <SheetTitle className="text-[#0B2046]">Menú</SheetTitle>
                        <SheetDescription className="sr-only">Navegación del marketplace</SheetDescription>
                    </SheetHeader>
                    <nav className="flex flex-col gap-1 p-3">
                        {!isAuthenticated && (
                            <>
                                <Button asChild className="h-11 bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] font-bold">
                                    <Link to="/register" onClick={() => setMenuOpen(false)}>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Crear cuenta gratis
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-11 border-[#0B2046] text-[#0B2046] font-semibold hover:bg-slate-50"
                                    onClick={fromMenu(onRequireAuth)}
                                >
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Iniciar sesión
                                </Button>
                                <p className="px-1 pt-1 text-center text-xs text-slate-500">
                                    ¿Ya tienes cuenta? Inicia sesión. ¿Eres nuevo? Crea tu cuenta gratis.
                                </p>
                                <div className="my-2 border-t border-slate-100" />
                            </>
                        )}
                        <button className={menuItemClass} onClick={fromMenu(() => handleActionClick('quote'))}>
                            <FilePlus2 className="w-4 h-4 text-slate-400" />
                            Solicitar cotización
                        </button>
                        <button className={menuItemClass} onClick={fromMenu(goToCategories)}>
                            <Grid className="w-4 h-4 text-slate-400" />
                            Categorías
                        </button>
                        <button className={menuItemClass} onClick={fromMenu(goToProducts)}>
                            <Package className="w-4 h-4 text-slate-400" />
                            Productos
                        </button>
                        <button className={menuItemClass} onClick={fromMenu(goToHowItWorks)}>
                            <HelpCircle className="w-4 h-4 text-slate-400" />
                            Cómo funciona
                        </button>
                        <a
                            href="https://vender.bitobbu.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={menuItemClass}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Store className="w-4 h-4 text-slate-400" />
                            Vender en Bitobbu
                        </a>
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    );
}
