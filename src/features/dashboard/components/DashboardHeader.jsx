import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardHeader({ userName, onNewSolicitud }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Hola, {userName || 'Bienvenido'} 👋
                </h1>
                <p className="text-slate-500 mt-1">Aquí está el resumen de tu actividad</p>
            </div>
            <Button
                onClick={onNewSolicitud}
                className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] font-semibold px-6 h-12 rounded-xl shadow-lg shadow-[#D2FC31]/25"
            >
                <Plus className="w-5 h-5 mr-2" />
                Solicitar Cotización
            </Button>
        </motion.div>
    );
}
