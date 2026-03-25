import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Users, Zap } from 'lucide-react';

const FEATURES = [
    { icon: ShoppingBag, text: 'Marketplace mayorista B2B' },
    { icon: Users, text: 'Red de proveedores verificados' },
    { icon: TrendingUp, text: 'Cotizaciones en tiempo real' },
    { icon: Zap, text: 'Negocia directamente con proveedores' },
];

/**
 * Reusable left-hand branding panel for auth pages.
 * @param {{ title: React.ReactNode, subtitle: string }} props
 */
export default function AuthBrandPanel({ title, subtitle }) {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-[#1E293B] flex-col justify-between p-12">
            <div>
                <div className="flex items-center gap-3 mb-16">
                    <div className="w-12 h-12 bg-[#D2FC31] rounded-2xl flex items-center justify-center">
                        <span className="text-foreground font-bold text-2xl">B</span>
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tight">Bitobbu</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                        {title}
                    </h2>
                    <p className="text-slate-400 text-lg mb-12">
                        {subtitle}
                    </p>

                    <div className="space-y-4">
                        {FEATURES.map(({ icon: Icon, text }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-10 h-10 bg-[#D2FC31]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-[#D2FC31]" />
                                </div>
                                <span className="text-slate-300">{text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <p className="text-slate-600 text-sm">
                © 2026 Bitobbu · Todos los derechos reservados
            </p>
        </div>
    );
}
