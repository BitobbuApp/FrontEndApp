import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
    Settings, Globe, MapPin, Package,
    Users, FileText, Plus, Box, Loader2,
    Phone, Mail, Instagram, Linkedin, ExternalLink, Music,
    Calendar, BadgeCheck, ShieldCheck,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import useProfileData from './hooks/useProfileData';
import useCompanyProducts from './hooks/useCompanyProducts';
import ProductSmallCard from './components/ProductSmallCard';
import AddProductModal from './components/AddProductModal';

function getMetadataLabel(value) {
    if (typeof value === 'string') {
        return value;
    }

    if (!value || typeof value !== 'object') {
        return '';
    }

    if (typeof value.name === 'string') {
        return value.name;
    }

    if (typeof value.method === 'string') {
        return value.method;
    }

    if (value.method && typeof value.method === 'object') {
        return value.method.name || value.method.name_es || value.method.name_en || '';
    }

    return value.name_es || value.name_en || '';
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const [showAddProduct, setShowAddProduct] = useState(false);

    const {
        user,
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

    const score = rating;
    const reviews = totalReviews;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* ── Cover + Avatar ── */}
            <div className="relative">
                {/* Banner */}
                <div className="h-36 w-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900" />

                {/* Avatar overlapping the banner */}
                <div className="absolute -bottom-8 left-6">
                    <div className="w-20 h-20 rounded-full bg-background border-4 border-white shadow flex items-center justify-center overflow-hidden">
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
                    <h1 className="text-2xl font-bold text-foreground">{tradeName}</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        {companyType && (
                            <Badge variant="secondary" className="text-xs">{companyType}</Badge>
                        )}
                        {sector && (
                            <Badge variant="outline" className="text-xs">{sector}</Badge>
                        )}
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

            {/* ── Trust Score ── */}
            <Card className="mb-8 border border-border shadow-sm overflow-hidden bg-slate-50/50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-[#a8d92a]" />
                            <h3 className="font-semibold text-foreground text-lg">Nivel de Confianza</h3>
                        </div>
                        <span className="font-bold text-xl">{trustScore}%</span>
                    </div>
                    <Progress value={trustScore} className="h-3 mb-2" />
                    <p className="text-sm text-slate-500">
                        {trustScore >= 100 
                            ? '¡Tu perfil esta completo! Tienes mayor probabilidad de cerrar negocios.' 
                            : 'Completa tu perfil para aumentar la confianza de otros usuarios en la plataforma.'}
                    </p>
                </CardContent>
            </Card>

            {/* ── Bio + Social — two cards side by side ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

                {/* About / Bio card */}
                <Card className="border border-border shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Sobre Nosotros</h3>

                        {company?.bio ? (
                            <p className="text-sm text-slate-600 leading-relaxed">{company.bio}</p>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Sin descripción aún.</p>
                        )}

                        {location && (
                            <div className="flex items-start gap-2 pt-1">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-slate-700">{location}</p>
                                    {company?.locations?.[0]?.national_coverage && (
                                        <span className="inline-block mt-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Cobertura Nacional</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {company?.founding_year && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <p className="text-sm text-slate-700">Fundada en {company.founding_year}</p>
                            </div>
                        )}

                        {company?.commercial_profile?.works_with_credit && (
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                                <BadgeCheck className="w-4 h-4" />
                                Trabaja con crédito
                            </div>
                        )}

                        {company?.payment_methods?.length > 0 && (
                            <div>
                                <p className="text-xs text-slate-400 mb-1.5">Métodos de pago:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {company.payment_methods.map((pm) => (
                                        <span
                                            key={getMetadataLabel(pm) || JSON.stringify(pm)}
                                            className="inline-block text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                                        >
                                            {getMetadataLabel(pm)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Social links card */}
                <Card className="border border-border shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Redes Sociales</h3>

                        {(() => {
                            const PLATFORM_CONFIG = {
                                instagram:      { label: 'Instagram',          bg: 'bg-pink-50 dark:bg-pink-950/20',    border: 'border-pink-200 dark:border-pink-800',    text: 'text-pink-700 dark:text-pink-300',    iconColor: 'text-pink-500',    icon: Instagram },
                                tiktok:         { label: 'TikTok',             bg: 'bg-slate-50 dark:bg-slate-900/50',  border: 'border-slate-200 dark:border-slate-700',  text: 'text-slate-800 dark:text-slate-200',  iconColor: 'text-slate-700',   icon: Music },
                                facebook:       { label: 'Facebook',           bg: 'bg-blue-50 dark:bg-blue-950/20',    border: 'border-blue-200 dark:border-blue-800',    text: 'text-blue-800 dark:text-blue-300',    iconColor: 'text-blue-600',    icon: Globe },
                                website:        { label: 'Sitio Web',          bg: 'bg-muted/50',                       border: 'border-border',                           text: 'text-slate-700 dark:text-slate-300',  iconColor: 'text-slate-500',   icon: Globe },
                                google_business:{ label: 'Google My Business', bg: 'bg-red-50 dark:bg-red-950/20',      border: 'border-red-200 dark:border-red-800',      text: 'text-red-700 dark:text-red-300',      iconColor: 'text-red-500',     icon: Globe },
                                linkedin:       { label: 'LinkedIn',           bg: 'bg-blue-50 dark:bg-blue-950/20',    border: 'border-blue-200 dark:border-blue-800',    text: 'text-blue-800 dark:text-blue-300',    iconColor: 'text-blue-700',    icon: Linkedin },
                                twitter:        { label: 'X (Twitter)',        bg: 'bg-slate-50 dark:bg-slate-900/50',  border: 'border-slate-200 dark:border-slate-700',  text: 'text-slate-800 dark:text-slate-200',  iconColor: 'text-slate-700',   icon: Globe },
                            };

                            const socialLinks = (company?.social_media || []).filter(sm => sm?.url);

                            if (!socialLinks.length) {
                                return (
                                    <p className="text-sm text-slate-400 italic">
                                        No hay redes sociales configuradas.
                                    </p>
                                );
                            }

                            return (
                                <div className="space-y-2">
                                    {socialLinks.map(({ platform, url }) => {
                                        const config = PLATFORM_CONFIG[platform];
                                        if (!config) return null;
                                        const Icon = config.icon;
                                        return (
                                            <a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${config.bg} ${config.border} ${config.text} text-sm font-medium hover:opacity-80 transition-opacity`}
                                            >
                                                <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
                                                <span className="truncate">{config.label}</span>
                                                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-40" />
                                            </a>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </CardContent>
                </Card>

            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-6">
                {[
                    { icon: Box, label: 'Productos', value: products, color: 'text-blue-500' },
                    { icon: Users, label: 'Transacciones', value: transactions, color: 'text-purple-500' },
                    { icon: FileText, label: 'Calificación', value: score.toFixed(1), color: 'text-amber-500' },
                    { icon: FileText, label: 'Reseñas', value: reviews, color: 'text-slate-400' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <Card key={label} className="border border-border shadow-sm">
                        <CardContent className="p-5 flex flex-col items-center gap-2 text-center">
                            <Icon className={`w-7 h-7 ${color}`} />
                            <p className="text-2xl font-bold text-foreground">{value}</p>
                            <p className="text-xs text-slate-500">{label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Tabs ── */}
            <Tabs defaultValue="vitrina">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="vitrina">Mi Vitrina</TabsTrigger>
                </TabsList>

                <TabsContent value="vitrina" className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Mis Productos</h3>
                        <Button
                            size="sm"
                            className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] gap-1.5"
                            onClick={() => setShowAddProduct(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Producto
                        </Button>
                    </div>

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
                                <p className="font-medium text-slate-600">Tu vitrina está vacía</p>
                                <p className="text-sm text-slate-400 max-w-xs">
                                    Agrega productos para que los compradores puedan verlos
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            <AddProductModal
                open={showAddProduct}
                onOpenChange={setShowAddProduct}
            />
        </div>
    );
}
