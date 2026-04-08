import React from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, 
    Tag, 
    CheckCircle, 
    TrendingDown, 
    Mail, 
    Send, 
    ShoppingBag, 
    BarChart3 
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

export default function StatsGrid({ stats, company }) {
    if (!stats) return null;

    const { buyer_stats, supplier_stats } = stats;
    const canBuy = company?.can_buy;
    const canSell = company?.can_sell;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    return (
        <div className="space-y-8">
            {/* Buyer Section */}
            {canBuy && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">
                        Como Comprador
                    </h3>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        <StatCard
                            title="Solicitudes Generadas"
                            value={buyer_stats.generated_requests}
                            icon={FileText}
                            bgColor="bg-indigo-50"
                            iconColor="text-indigo-600"
                        />
                        <StatCard
                            title="Cotizaciones Recibidas"
                            value={buyer_stats.received_quotes}
                            icon={Tag}
                            bgColor="bg-blue-50"
                            iconColor="text-blue-600"
                        />
                        <StatCard
                            title="Compras Generadas"
                            value={buyer_stats.generated_purchases}
                            icon={CheckCircle}
                            bgColor="bg-emerald-50"
                            iconColor="text-emerald-600"
                        />
                        <StatCard
                            title="Ahorro Estimado"
                            value={`$${buyer_stats.estimated_savings}`}
                            icon={TrendingDown}
                            bgColor="bg-[#D2FC31]/10"
                            iconColor="text-slate-900"
                        />
                    </motion.div>
                </div>
            )}

            {/* Supplier Section */}
            {canSell && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">
                        Como Proveedor
                    </h3>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        <StatCard
                            title="Solicitudes Recibidas"
                            value={supplier_stats.received_requests}
                            icon={Mail}
                            bgColor="bg-orange-50"
                            iconColor="text-orange-600"
                        />
                        <StatCard
                            title="Cotizaciones Creadas"
                            value={supplier_stats.created_quotes}
                            icon={Send}
                            bgColor="bg-sky-50"
                            iconColor="text-sky-600"
                        />
                        <StatCard
                            title="Ventas Generadas"
                            value={supplier_stats.generated_sales}
                            icon={ShoppingBag}
                            bgColor="bg-teal-50"
                            iconColor="text-teal-600"
                        />
                        <StatCard
                            title="Ingresos Generados"
                            value={`$${Number(supplier_stats.generated_revenue || 0).toLocaleString()}`}
                            icon={BarChart3}
                            bgColor="bg-[#D2FC31]"
                            iconColor="text-slate-900"
                        />
                    </motion.div>
                </div>
            )}
        </div>
    );
}
