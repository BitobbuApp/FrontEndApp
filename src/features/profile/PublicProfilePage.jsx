import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Star, FileText, Package, Users, Loader2,
    Phone, Mail, Globe, Instagram, Linkedin, ExternalLink, Music,
    Calendar, BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import usePublicProfileData from './hooks/usePublicProfileData';
import useCompanyProducts from './hooks/useCompanyProducts';
import ProductSmallCard from './components/ProductSmallCard';

export default function PublicProfilePage() {
    const navigate = useNavigate();

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
    } = usePublicProfileData();

    const { data: companyProducts = [], isLoading: isLoadingProducts } = useCompanyProducts(company?.id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!company) {
        return (
            <div className="text-center py-20 text-slate-500">
                No se encontró el perfil de la empresa.
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Back button */}
            <div>
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-slate-500">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
            </div>

            {/* Cover + Avatar */}
            <div className="relative">
                <div className="h-36 w-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900" />
                <div className="absolute -bottom-8 left-6">
                    <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow flex items-center justify-center overflow-hidden">
                        {company.logo_url ? (
                            <img src={company.logo_url} alt={tradeName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-slate-700">{initial}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Company identity */}
            <div className="pt-12 pb-5 px-1">
                <h1 className="text-2xl font-bold text-[#1E293B]">{tradeName}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {companyType && <Badge variant="secondary" className="text-xs">{companyType}</Badge>}
                    {sector && <Badge variant="outline" className="text-xs">{sector}</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
                    {location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {location}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {rating.toFixed(1)} ({totalReviews} reseñas)
                    </span>
                    <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {transactions} transacciones
                    </span>
                </div>
                {company.bio && (
                    <p className="text-sm text-slate-600 mt-3 max-w-2xl">{company.bio}</p>
                )}
            </div>

            {/* Contact / Social card */}
            <Card className="border border-slate-100 shadow-sm">
                <CardContent className="p-6 space-y-5">
                    <h3 className="text-base font-semibold text-[#1E293B]">Contacto y Redes</h3>

                    {location && (
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-[#1E293B] text-sm">{location}</p>
                                {company.locations?.[0]?.national_coverage && (
                                    <span className="inline-block mt-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Cobertura Nacional</span>
                                )}
                            </div>
                        </div>
                    )}

                    {company.founding_year && (
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <p className="text-sm text-[#1E293B]">Fundada en {company.founding_year}</p>
                        </div>
                    )}

                    {(() => {
                        const contact = company.contacts?.[0] || {};
                        const links = [
                            company.website   && { icon: Globe,     label: 'Sitio Web',  href: company.website },
                            company.instagram && { icon: Instagram, label: 'Instagram',  href: `https://instagram.com/${company.instagram.replace('@', '')}` },
                            company.linkedin  && { icon: Linkedin,  label: 'LinkedIn',   href: company.linkedin },
                            company.tiktok    && { icon: Music,     label: 'TikTok',     href: `https://tiktok.com/@${company.tiktok.replace('@', '')}` },
                            contact.whatsapp  && { icon: Phone,     label: 'WhatsApp',   href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` },
                            contact.corporate_email && { icon: Mail, label: 'Email',     href: `mailto:${contact.corporate_email}` },
                        ].filter(Boolean);

                        if (!links.length) return null;

                        return (
                            <div className="grid grid-cols-2 gap-2">
                                {links.map(({ icon: Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                        {label}
                                    </a>
                                ))}
                            </div>
                        );
                    })()}

                    <div className="border-t border-slate-100" />

                    {company.commercial_profile?.works_with_credit && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <BadgeCheck className="w-4 h-4" />
                            Trabaja con crédito
                        </div>
                    )}

                    {company.payment_methods?.length > 0 && (
                        <div>
                            <p className="text-xs text-slate-400 mb-2">Métodos de pago:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {company.payment_methods.map((pm) => (
                                    <span
                                        key={typeof pm === 'string' ? pm : pm.method}
                                        className="inline-block text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                                    >
                                        {typeof pm === 'string' ? pm : pm.method}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: Package, label: 'Productos',     value: products,              color: 'text-blue-500' },
                    { icon: Users,   label: 'Transacciones', value: transactions,           color: 'text-purple-500' },
                    { icon: Star,    label: 'Calificación',  value: rating.toFixed(1),      color: 'text-amber-500' },
                    { icon: FileText, label: 'Reseñas',      value: totalReviews,           color: 'text-slate-400' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <Card key={label} className="border border-slate-100 shadow-sm">
                        <CardContent className="p-5 flex flex-col items-center gap-2 text-center">
                            <Icon className={`w-7 h-7 ${color}`} />
                            <p className="text-2xl font-bold text-[#1E293B]">{value}</p>
                            <p className="text-xs text-slate-500">{label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs — read-only */}
            <Tabs defaultValue="vitrina">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="vitrina">Vitrina</TabsTrigger>
                    <TabsTrigger value="resenas">Reseñas</TabsTrigger>
                </TabsList>

                <TabsContent value="vitrina" className="mt-4">
                    {isLoadingProducts ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                        </div>
                    ) : companyProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {companyProducts.map((p) => (
                                <ProductSmallCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-sm">
                            <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <Package className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="font-medium text-slate-600">Vitrina vacía</p>
                                <p className="text-sm text-slate-400">Esta empresa aún no tiene productos publicados</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="resenas" className="mt-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                <Star className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-medium text-slate-600">Sin reseñas aún</p>
                            <p className="text-sm text-slate-400">Esta empresa no ha recibido reseñas todavía</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
