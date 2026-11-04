import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
    Settings, Globe, MapPin, Package, Plus, Loader2, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useProfileData from './hooks/useProfileData';
import CompanySubcategories from './components/CompanySubcategories';
import useCompanyProducts from './hooks/useCompanyProducts';
import ProductSmallCard from './components/ProductSmallCard';
import AddProductModal from './components/AddProductModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from './services/productsApi';
import { toast } from 'sonner';
import { StatsStrip, TrustCard, CommercialCard, SocialCard } from './components/ProfileCards';

export default function ProfilePage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);

    const deleteMutation = useMutation({
        mutationFn: (id) => productsApi.deleteProduct(id),
        onSuccess: () => {
            toast.success('Producto eliminado');
            queryClient.invalidateQueries({ queryKey: ['companyProducts'] });
            setProductToDelete(null);
        },
        onError: () => toast.error('Error al eliminar producto')
    });

    const {
        company,
        isLoading,
        initial,
        tradeName,
        sector,
        companyType,
        location,
        rating,
        totalReviews,
        transactions,
        products,
        trustScore,
    } = useProfileData();

    const { data: companyProducts = [], isLoading: isLoadingProducts } = useCompanyProducts(company?.id);

    const openAddProduct = () => {
        setProductToEdit(null);
        setShowAddProduct(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">

            {/* ── Header card: banner, identity, stats ── */}
            <Card className="overflow-hidden rounded-3xl border border-border shadow-sm">
                <div className="relative h-32 bg-gradient-to-br from-[#0B2046] via-[#0F2858] to-[#1c3a4f] sm:h-40" />

                <div className="relative px-6 pb-6 sm:px-10">
                    <div className="-mt-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-white shadow-lg sm:-mt-14 sm:h-28 sm:w-28">
                        {company?.logo_url ? (
                            <img src={company.logo_url} alt={tradeName} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-[#0B2046]">{initial}</span>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 sm:absolute sm:right-10 sm:top-4 sm:mt-0">
                        <Button variant="outline" className="gap-2 rounded-xl" asChild>
                            <Link to={createPageUrl('Configuracion')}>
                                <Settings className="h-4 w-4" />
                                Configuración
                            </Link>
                        </Button>
                        <Button
                            className="gap-2 rounded-xl bg-[#0B2046] text-white hover:bg-[#16305a]"
                            onClick={() => navigate(`/Perfil/${company?.id}`)}
                            disabled={!company?.id}
                        >
                            <Globe className="h-4 w-4" />
                            Ver como público
                        </Button>
                    </div>

                    <div className="mt-4 space-y-4 sm:mt-5">
                        <h2 className="text-3xl font-bold text-[#0B2046] sm:text-4xl">{tradeName}</h2>

                        <div className="flex flex-wrap items-center gap-2">
                            {companyType && (
                                <Badge className="rounded-full bg-[#0B2046] px-3 py-1 text-sm font-semibold text-white hover:bg-[#0B2046]">
                                    {companyType}
                                </Badge>
                            )}
                            {sector && (
                                <Badge className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-[#0B2046] hover:bg-slate-100">
                                    {sector}
                                </Badge>
                            )}
                        </div>

                        <CompanySubcategories
                            subcategories={company?.subcategories_of_interest}
                            editable
                        />

                        {(company?.founding_year || location) && (
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-600">
                                {company?.founding_year && (
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        Fundada en {company.founding_year}
                                    </span>
                                )}
                                {location && (
                                    <span className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        {location}
                                        {company?.locations?.[0]?.national_coverage && (
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                                Cobertura nacional
                                            </span>
                                        )}
                                    </span>
                                )}
                            </div>
                        )}

                        {company?.bio ? (
                            <p className="max-w-3xl leading-relaxed text-slate-600">{company.bio}</p>
                        ) : (
                            <p className="italic text-slate-400">Sin descripción aún.</p>
                        )}
                    </div>
                </div>

                <StatsStrip
                    products={products}
                    transactions={transactions}
                    score={rating}
                    reviews={totalReviews}
                />
            </Card>

            {/* ── Sidebar cards + showcase ── */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_2fr]">
                <div className="space-y-6">
                    <TrustCard trustScore={trustScore} isOwner />
                    <CommercialCard company={company} isOwner />
                    <SocialCard company={company} />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0B2046] shadow-sm">
                            Mi vitrina{' '}
                            <span className="ml-1 text-slate-500">{companyProducts.length}</span>
                        </span>
                        <Button
                            className="gap-2 rounded-xl bg-[#D2FC31] font-semibold text-slate-900 hover:bg-[#c4ed2d]"
                            onClick={openAddProduct}
                        >
                            <Plus className="h-4 w-4" />
                            Agregar producto
                        </Button>
                    </div>

                    {isLoadingProducts ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                        </div>
                    ) : companyProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {companyProducts.map((p) => (
                                <ProductSmallCard
                                    key={p.id}
                                    product={p}
                                    onEdit={(prod) => {
                                        setProductToEdit(prod);
                                        setShowAddProduct(true);
                                    }}
                                    onDelete={(prod) => setProductToDelete(prod)}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="rounded-3xl border border-border shadow-sm">
                            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                    <Package className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-lg font-semibold text-[#0B2046]">Tu vitrina está vacía</p>
                                <p className="max-w-xs text-slate-500">
                                    Agrega productos para que los compradores puedan verlos
                                </p>
                                <Button variant="outline" className="mt-2 gap-2 rounded-xl" onClick={openAddProduct}>
                                    <Plus className="h-4 w-4" />
                                    Agregar mi primer producto
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <AddProductModal
                open={showAddProduct}
                onOpenChange={(isOpen) => {
                    setShowAddProduct(isOpen);
                    if (!isOpen) setProductToEdit(null);
                }}
                initialData={productToEdit}
            />

            <AlertDialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará el producto "{productToDelete?.name}" de tu vitrina.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                deleteMutation.mutate(productToDelete.id);
                            }}
                            disabled={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
