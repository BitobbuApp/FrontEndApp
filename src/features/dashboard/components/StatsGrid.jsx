import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, 
    TrendingDown, 
    MessageSquare,
    ShoppingCart,
    TrendingUp
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import tooltips from '@/constants/tooltips.json';

export default function StatsGrid({ stats, company }) {
    const canBuy = company?.can_buy;
    const canSell = company?.can_sell;

    const [viewMode, setViewMode] = useState(canBuy ? 'buyer' : 'supplier');

    if (!stats) return null;
    const { buyer_stats, supplier_stats } = stats;

    if (!canBuy && !canSell) return null;

    const showToggle = canBuy && canSell;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Resumen de Actividad Semanal</h2>
                    <p className="text-sm text-slate-500">
                        Visualizando métricas como {viewMode === 'buyer' ? 'Comprador' : 'Proveedor'}
                    </p>
                </div>
                
                {showToggle && (
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-hidden">
                        <button
                            onClick={() => setViewMode('buyer')}
                            className={`flex-1 sm:flex-none px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                                viewMode === 'buyer' 
                                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Vista Comprador
                        </button>
                        <button
                            onClick={() => setViewMode('supplier')}
                            className={`flex-1 sm:flex-none px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                                viewMode === 'supplier' 
                                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Vista Proveedor
                        </button>
                    </div>
                )}
            </div>

            {/* Buyer Section */}
            {viewMode === 'buyer' && canBuy && (
                <div className="space-y-4">
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
                            trend={+12}
                            info={tooltips.dashboard.buyer.generated_requests}
                        />
                        <StatCard
                            title="Cotizaciones Recibidas"
                            value={buyer_stats.received_quotes}
                            icon={MessageSquare}
                            trend={+5}
                            info={tooltips.dashboard.buyer.received_quotes}
                        />
                        <StatCard
                            title="Compras Generadas"
                            value={buyer_stats.generated_purchases}
                            icon={ShoppingCart}
                            trend={+8}
                            info={tooltips.dashboard.buyer.generated_purchases}
                        />
                        <StatCard
                            title="Ahorro Estimado"
                            value={`$${Number(buyer_stats.estimated_savings || 0).toLocaleString()}`}
                            icon={TrendingDown}
                            trend={-15}
                            info={tooltips.dashboard.buyer.estimated_savings}
                        />
                    </motion.div>
                </div>
            )}

            {/* Supplier Section */}
            {viewMode === 'supplier' && canSell && (
                <div className="space-y-4">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        <StatCard
                            title="Solicitudes Recibidas"
                            value={supplier_stats.received_requests}
                            icon={FileText}
                            trend={+20}
                            info={tooltips.dashboard.supplier.received_requests}
                        />
                        <StatCard
                            title="Cotizaciones Creadas"
                            value={supplier_stats.created_quotes}
                            icon={MessageSquare}
                            trend={+15}
                            info={tooltips.dashboard.supplier.created_quotes}
                        />
                        <StatCard
                            title="Ventas Generadas"
                            value={supplier_stats.generated_sales}
                            icon={ShoppingCart}
                            trend={+10}
                            info={tooltips.dashboard.supplier.generated_sales}
                        />
                        <StatCard
                            title="Ingresos Generados"
                            value={`$${Number(supplier_stats.generated_revenue || 0).toLocaleString()}`}
                            icon={TrendingUp}
                            trend={+25}
                            info={tooltips.dashboard.supplier.generated_revenue}
                        />
                    </motion.div>
                </div>
            )}
        </div>
    );
}
