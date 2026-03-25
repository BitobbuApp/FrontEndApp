import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Tag, DollarSign, Users } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

export default function StatsGrid({ stats }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
            <StatCard
                title="Cotizaciones Activas"
                value={stats.cotizacionesActivas}
                icon={FileText}
                bgColor="bg-[#D2FC31]"
                iconColor="text-foreground"
            />
            <StatCard
                title="Ofertas Recibidas"
                value={stats.ofertasRecibidas}
                icon={Tag}
                bgColor="bg-blue-100"
                iconColor="text-blue-600"
            />
            <StatCard
                title="Negocios Cerrados"
                value={stats.negociosCerrados}
                icon={DollarSign}
                bgColor="bg-emerald-100"
                iconColor="text-emerald-600"
            />
            <StatCard
                title="Proveedores Conectados"
                value={stats.proveedoresConectados}
                icon={Users}
                bgColor="bg-purple-100"
                iconColor="text-purple-600"
            />
        </motion.div>
    );
}
