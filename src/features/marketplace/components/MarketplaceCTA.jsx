import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function MarketplaceCTA() {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-[#E0F2FE] rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 my-16 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B2046] leading-tight"
                    >
                        Haz crecer tu red de <br className="hidden md:block" />
                        negocios B2B hoy mismo
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-slate-700 text-lg md:text-xl"
                    >
                        Únete a miles de empresas que ya están conectando con distribuidores, fabricantes y mayoristas certificados en Venezuela.
                    </motion.p>
                </div>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex-shrink-0 w-full md:w-auto"
                >
                    <Button 
                        onClick={() => navigate('/register')}
                        className="w-full md:w-auto h-14 px-8 bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-[#D2FC31]/25 transition-all group"
                    >
                        Regístrate gratis
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
