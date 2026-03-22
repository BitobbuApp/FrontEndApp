import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { companyApi } from '@/features/settings/services/companyApi';
import { createPageUrl } from '@/utils';
import {
    Settings, Globe, MapPin, Star, ArrowRight, Package,
    Users, FileText, Plus, Box, Loader2,
    Phone, Mail, Instagram, Linkedin, ExternalLink, Music,
    Calendar, BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export default function ProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: company, isLoading } = useQuery({
        queryKey: ['myCompany', user?.company_id || user?.id],
        queryFn: async () => {
            if (user?.company_id) {
                const res = await companyApi.getCompanyById(user.company_id);
                return res.data;
            }
            if (user?.has_company) {
                const res = await companyApi.getMyCompany();
                return res.data;
            }
            return null;
        },
        enabled: !!user,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    const initial = company?.trade_name?.[0] || company?.nombre_comercial?.[0] || user?.full_name?.[0] || 'C';
    const tradeName = company?.trade_name || company?.nombre_comercial || user?.full_name || 'Mi Empresa';
    const sector = company?.sector || '';
    const companyType = company?.company_type || company?.tipo_empresa || '';
    const location = [
        company?.locations?.[0]?.location_city,
        company?.locations?.[0]?.location_state,
    ].filter(Boolean).join(', ') || company?.ubicacion_ciudad || '';
    const rating = company?.average_rating ?? 0;
    const totalReviews = company?.total_reviews ?? 0;
    const transactions = company?.total_transactions ?? company?.transacciones ?? 0;
    const products = company?.products_count ?? 0;
    const score = company?.average_rating ?? 0;
    const reviews = company?.total_reviews ?? 0;

    return (
        <div className="max-w-5xl mx-auto space-y-0">

            {/* ── Cover + Avatar ── */}
            <div className="relative">
                {/* Banner */}
                <div className="h-36 w-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900" />

                {/* Avatar overlapping the banner */}
                <div className="absolute -bottom-8 left-6">
                    <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow flex items-center justify-center overflow-hidden">
                        {company?.logo_url ? (
                            <img src={company.logo_url} alt={tradeName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-slate-700">{initial}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Company identity + actions ── */}
            <div className="pt-12 pb-5 px-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-bold text-[#1E293B]">{tradeName}</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        {companyType && (
                            <Badge variant="secondary" className="text-xs">{companyType}</Badge>
                        )}
                        {sector && (
                            <Badge variant="outline" className="text-xs">{sector}</Badge>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-0.5">
                        {location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {location}
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {score.toFixed(1)} ({totalReviews} reseñas)
                        </span>
                        <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {transactions} transacciones
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                        <Link to={createPageUrl('Configuracion')}>
                            <Settings className="w-4 h-4" />
                            Configuración
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => navigate(`/Perfil/${company?.id}`)}
                        disabled={!company?.id}
                    >
                        <Globe className="w-4 h-4" />
                        Ver como público
                    </Button>
                </div>
            </div>

            {/* ── Contact / Social card ── */}
            <div className="mb-2">
                <Card className="border border-slate-100 shadow-sm">
                    <CardContent className="p-6 space-y-5">
                        <h3 className="text-base font-semibold text-[#1E293B]">Contacto y Redes</h3>

                        {/* Location */}
                        {location && (
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-[#1E293B] text-sm">{location}</p>
                                    {company?.locations?.[0]?.national_coverage && (
                                        <span className="inline-block mt-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Cobertura Nacional</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Founded year */}
                        {company?.founding_year && (
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                <p className="text-sm text-[#1E293B]">Fundada en {company.founding_year}</p>
                            </div>
                        )}

                        {/* Social links — 2-column grid */}
                        {(() => {
                            const contact = company?.contacts?.[0] || {};
                            const links = [
                                company?.website   && { icon: Globe,     label: 'Sitio Web',  href: company.website },
                                company?.instagram && { icon: Instagram, label: 'Instagram',  href: `https://instagram.com/${company.instagram.replace('@','')}` },
                                company?.linkedin  && { icon: Linkedin,  label: 'LinkedIn',   href: company.linkedin },
                                company?.tiktok    && { icon: Music,     label: 'TikTok',     href: `https://tiktok.com/@${company.tiktok.replace('@','')}` },
                                contact.whatsapp   && { icon: Phone,     label: 'WhatsApp',   href: `https://wa.me/${contact.whatsapp.replace(/\D/g,'')}` },
                                contact.corporate_email && { icon: Mail, label: 'Email',      href: `mailto:${contact.corporate_email}` },
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

                        {company?.commercial_profile?.works_with_credit && (
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                                <BadgeCheck className="w-4 h-4" />
                                Trabaja con crédito
                            </div>
                        )}

                        {company?.payment_methods?.length > 0 && (
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
            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { icon: Box, label: 'Productos', value: products, color: 'text-blue-500' },
                    { icon: Users, label: 'Transacciones', value: transactions, color: 'text-purple-500' },
                    { icon: Star, label: 'Calificación', value: score.toFixed(1), color: 'text-amber-500' },
                    { icon: FileText, label: 'Reseñas', value: reviews, color: 'text-slate-400' },
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

            {/* ── Tabs ── */}
            <Tabs defaultValue="vitrina">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="vitrina">Mi Vitrina</TabsTrigger>
                    <TabsTrigger value="historial">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="vitrina" className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[#1E293B]">Mis Productos</h3>
                        <Button
                            size="sm"
                            className="bg-[#D2FC31] text-[#1E293B] hover:bg-[#c4ed2d] gap-1.5"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Producto
                        </Button>
                    </div>

                    {/* Empty state */}
                    <Card className="border-0 shadow-sm">
                        <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                <Package className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-medium text-slate-600">Tu vitrina está vacía</p>
                            <p className="text-sm text-slate-400 max-w-xs">
                                Agrega productos para que los compradores puedan verlos
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="historial" className="mt-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                <FileText className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-medium text-slate-600">Sin historial de transacciones</p>
                            <p className="text-sm text-slate-400 max-w-xs">
                                Tus transacciones completadas aparecerán aquí
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
