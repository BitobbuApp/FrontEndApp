import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function QuickTipBanner() {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <Card className="border-0 shadow-sm bg-gradient-to-r from-[#1E293B] to-slate-700">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#D2FC31] rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-foreground" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">
                                    Mejora tu visibilidad
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Actualiza a Premium y destaca en las búsquedas de proveedores
                                </p>
                            </div>
                        </div>
                        <Link to={createPageUrl('Configuracion') + '?tab=suscripcion'}>
                            <Button className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] font-semibold">
                                Conocer más
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
