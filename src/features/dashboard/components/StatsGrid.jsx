import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Tag, DollarSign, Users, PiggyBank } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

export default function StatsGrid({ stats }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
            <StatCard
                title="Cotizaciones Activas"
                value={stats.cotizacionesActivas}
                icon={FileText}
                trendValue="+12% este mes"
                trend="up"
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
                value={stats.ventasGeneradas}
                icon={DollarSign}
                bgColor="bg-emerald-100"
                iconColor="text-emerald-600"
            />
            <StatCard
                title="Proveedores"
                value={stats.proveedoresConectados}
                icon={Users}
                bgColor="bg-purple-100"
                iconColor="text-purple-600"
            />
            <StatCard
                title="Ahorro Estimado"
                value={`$${stats.ahorroEstimado.toLocaleString()}`}
                icon={PiggyBank}
                bgColor="bg-amber-100"
                iconColor="text-amber-600"
            />
        </motion.div>
    );
}
