import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { useMyCompany } from '@/features/settings/hooks/useMyCompany';

const ADD_PRODUCT = { label: 'Publicar mi primer producto', to: '/Perfil', state: { openAddProduct: true } };
const NEW_REQUEST = { label: 'Pedir mi primera cotización', to: '/Requests/new' };

function resolveActions(company) {
    if (company?.can_sell && company?.can_buy) return { primary: ADD_PRODUCT, secondary: NEW_REQUEST };
    if (company?.can_sell) return { primary: ADD_PRODUCT, secondary: { label: 'Ver posibles clientes', to: '/PosiblesClientes' } };
    return { primary: NEW_REQUEST, secondary: { label: 'Ver proveedores', to: '/Proveedores' } };
}

const GUIDE = {
    seller: 'Publica lo que vendes y los compradores lo verán aquí.',
    buyer: 'No tienes que esperar: cuéntanos qué necesitas y los proveedores te enviarán su cotización.',
    both: 'Publica lo que vendes o cuéntanos qué necesitas, como prefieras.',
};

export default function MarketplaceLaunchState() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { data: company } = useMyCompany();
    const { primary, secondary } = resolveActions(company);
    const guide = company?.can_sell && company?.can_buy ? GUIDE.both : company?.can_sell ? GUIDE.seller : GUIDE.buyer;

    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-8 px-2 text-center">
                    <div className="w-16 h-16 bg-[#0B2046] rounded-2xl flex items-center justify-center mb-5">
                        <PackageOpen className="w-8 h-8 text-[#D2FC31]" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Aún no hay productos publicados</h3>
                    <p className="text-slate-500 max-w-md mb-1">Estamos empezando. Tú puedes ser de los primeros.</p>

                    {/* Guests already get the sign-up buttons and steps in the hero above */}
                    {isAuthenticated && (
                        <>
                            <p className="text-slate-500 max-w-md mb-6">{guide}</p>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Button
                                    onClick={() => navigate(primary.to, primary.state ? { state: primary.state } : undefined)}
                                    className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] group"
                                >
                                    {primary.label}
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button variant="outline" onClick={() => navigate(secondary.to)}>
                                    {secondary.label}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
