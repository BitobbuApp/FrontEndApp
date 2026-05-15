import React from 'react';
import { Instagram, Globe, Linkedin, Twitter, Link } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PLATFORM_CONFIG = {
    instagram: {
        label: 'Instagram',
        placeholder: 'https://instagram.com/tu_empresa',
        icon: Instagram,
        color: 'text-pink-500',
        bg: 'bg-pink-50 dark:bg-pink-950/20',
        border: 'border-pink-200 dark:border-pink-800',
    },
    tiktok: {
        label: 'TikTok',
        placeholder: 'https://tiktok.com/@tu_empresa',
        icon: () => (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
            </svg>
        ),
        color: 'text-slate-900 dark:text-white',
        bg: 'bg-slate-50 dark:bg-slate-900/50',
        border: 'border-slate-200 dark:border-slate-700',
    },
    facebook: {
        label: 'Facebook',
        placeholder: 'https://facebook.com/tu_empresa',
        icon: () => (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        ),
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800',
    },
    website: {
        label: 'Sitio Web',
        placeholder: 'https://tuempresa.com',
        icon: Globe,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        border: 'border-emerald-200 dark:border-emerald-800',
    },
    google_business: {
        label: 'Google My Business',
        placeholder: 'https://maps.app.goo.gl/...',
        icon: () => (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>
        ),
        color: 'text-red-500',
        bg: 'bg-red-50 dark:bg-red-950/20',
        border: 'border-red-200 dark:border-red-800',
    },
    linkedin: {
        label: 'LinkedIn',
        placeholder: 'https://linkedin.com/company/tu_empresa',
        icon: Linkedin,
        color: 'text-blue-700',
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800',
    },
    twitter: {
        label: 'X (Twitter)',
        placeholder: 'https://x.com/tu_empresa',
        icon: Twitter,
        color: 'text-slate-900 dark:text-white',
        bg: 'bg-slate-50 dark:bg-slate-900/50',
        border: 'border-slate-200 dark:border-slate-700',
    },
};

export default function SocialMediaTab({ formData, setFormData }) {
    const links = formData.social_media_links || [];

    const handleChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            social_media_links: prev.social_media_links.map(item =>
                item.platform === platform ? { ...item, url: value } : item
            ),
        }));
    };

    return (
        <Card className="border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5 text-[#D2FC31]" />
                    Redes Sociales
                </CardTitle>
                <CardDescription>
                    Agrega los enlaces de tus redes sociales para aumentar tu visibilidad en el marketplace.
                    Solo se guardan los campos que tengan una URL.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {links.map(({ platform, url }) => {
                        const config = PLATFORM_CONFIG[platform];
                        if (!config) return null;
                        const Icon = config.icon;

                        return (
                            <div key={platform} className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${config.bg} border ${config.border} ${config.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </span>
                                    {config.label}
                                </Label>
                                <Input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleChange(platform, e.target.value)}
                                    placeholder={config.placeholder}
                                    className="text-sm"
                                />
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
