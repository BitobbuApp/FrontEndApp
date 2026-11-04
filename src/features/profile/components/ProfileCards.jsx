import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
    Globe, Users, FileText, Box,
    Instagram, Linkedin, ExternalLink, Music,
    ShieldCheck, Star, TriangleAlert, CircleCheck, CircleX, ArrowRight,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { InfoTooltip } from '@/components/shared/InfoTooltip';

const PLATFORM_CONFIG = {
    instagram: { label: 'Instagram', icon: Instagram },
    tiktok: { label: 'TikTok', icon: Music },
    facebook: { label: 'Facebook', icon: Globe },
    website: { label: 'Sitio web', icon: Globe },
    google_business: { label: 'Google My Business', icon: Globe },
    linkedin: { label: 'LinkedIn', icon: Linkedin },
    twitter: { label: 'X (Twitter)', icon: Globe },
};

export function getMetadataLabel(value) {
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

/** `tooltips` is an optional { products, transactions, rating, reviews } map of InfoTooltip texts. */
export function StatsStrip({ products, transactions, score, reviews, tooltips = {} }) {
    const stats = [
        { icon: Box, label: 'Productos', value: products, info: tooltips.products },
        { icon: Users, label: 'Transacciones', value: transactions, info: tooltips.transactions },
        { icon: Star, label: 'Calificación', value: score.toFixed(1), star: true, info: tooltips.rating },
        { icon: FileText, label: 'Reseñas', value: reviews, info: tooltips.reviews },
    ];

    return (
        <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
            {stats.map(({ icon: Icon, label, value, star, info }, index) => (
                <div
                    key={label}
                    className={`border-border p-5 ${index % 2 === 1 ? 'border-l' : ''} ${index > 1 ? 'border-t md:border-t-0' : ''} ${index > 0 ? 'md:border-l' : ''}`}
                >
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Icon className="h-4 w-4" />
                        {label}
                        {info && <InfoTooltip content={info} />}
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-3xl font-bold text-[#0B2046]">
                        {star && <Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
                        {value}
                    </p>
                </div>
            ))}
        </div>
    );
}

/** `isOwner` shows the "complete your profile" call to action; otherwise a caution note for visitors. */
export function TrustCard({ trustScore, isOwner = false, info }) {
    const complete = trustScore >= 100;

    return (
        <Card className="rounded-3xl border border-border shadow-sm">
            <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-[#0B2046]" />
                        <h3 className="flex items-center font-semibold text-[#0B2046]">
                            Nivel de confianza
                            {info && <InfoTooltip content={info} />}
                        </h3>
                    </div>
                    <span className="text-xl font-bold text-[#0B2046]">{trustScore}%</span>
                </div>
                <Progress value={trustScore} className="h-2 bg-slate-200 [&>div]:bg-[#0B2046]" />
                {complete ? (
                    <p className="text-sm text-slate-500">
                        {isOwner
                            ? '¡Tu perfil está completo! Tienes mayor probabilidad de cerrar negocios.'
                            : 'Este perfil está verificado y completo. Es altamente confiable.'}
                    </p>
                ) : (
                    <>
                        <div className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                            <TriangleAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <p>
                                {isOwner
                                    ? 'Completa tu perfil para aumentar la confianza de otros usuarios en la plataforma.'
                                    : 'Este perfil no está completo. Sugerimos tomar precauciones al hacer negocios.'}
                            </p>
                        </div>
                        {isOwner && (
                            <Link
                                to={createPageUrl('Configuracion')}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                            >
                                Completar perfil <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}

/** Always rendered: shows explicit empty states so the section never silently disappears. */
export function CommercialCard({ company, isOwner = false }) {
    const worksWithCredit = !!company?.commercial_profile?.works_with_credit;
    const paymentMethods = company?.payment_methods || [];

    return (
        <Card className="rounded-3xl border border-border shadow-sm">
            <CardContent className="space-y-4 p-6">
                <h3 className="font-semibold text-[#0B2046]">Condiciones comerciales</h3>

                <div
                    className={`flex items-center gap-2 font-medium ${worksWithCredit ? 'text-[#0B2046]' : 'text-slate-400'}`}
                >
                    {worksWithCredit ? (
                        <CircleCheck className="h-5 w-5 text-emerald-600" />
                    ) : (
                        <CircleX className="h-5 w-5" />
                    )}
                    {worksWithCredit ? 'Trabaja con crédito' : 'No trabaja con crédito'}
                </div>

                <div>
                    <p className="mb-2 text-sm text-slate-500">Métodos de pago</p>
                    {paymentMethods.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {paymentMethods.map((pm) => (
                                <span
                                    key={getMetadataLabel(pm) || JSON.stringify(pm)}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                                >
                                    {getMetadataLabel(pm)}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm italic text-slate-400">
                            {isOwner ? (
                                <>
                                    Aún no indicaste métodos de pago.{' '}
                                    <Link
                                        to={`${createPageUrl('Configuracion')}?tab=comercial`}
                                        className="not-italic font-medium text-blue-600 hover:underline"
                                    >
                                        Agregar
                                    </Link>
                                </>
                            ) : (
                                'No indicados.'
                            )}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function SocialCard({ company }) {
    const socialLinks = (company?.social_media || []).filter(
        (sm) => sm?.url && PLATFORM_CONFIG[sm.platform]
    );

    return (
        <Card className="rounded-3xl border border-border shadow-sm">
            <CardContent className="space-y-3 p-6">
                <h3 className="font-semibold text-[#0B2046]">Redes sociales</h3>
                {socialLinks.length === 0 ? (
                    <p className="text-sm italic text-slate-400">No hay redes sociales configuradas.</p>
                ) : (
                    <div className="space-y-1">
                        {socialLinks.map(({ platform, url }) => {
                            const { label, icon: Icon } = PLATFORM_CONFIG[platform];
                            return (
                                <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl px-1 py-2 font-medium text-[#0B2046] transition-colors hover:bg-slate-50"
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0 text-slate-500" />
                                    <span className="truncate">{label}</span>
                                    <ExternalLink className="ml-auto h-4 w-4 text-slate-400" />
                                </a>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
