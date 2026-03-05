import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useDashboardData from './hooks/useDashboardData';
import DashboardHeader from './components/DashboardHeader';
import StatsGrid from './components/StatsGrid';
import RecentQuotationsTable from './components/RecentQuotationsTable';
import OffersOfInterestTable from './components/OffersOfInterestTable';
import QuickTipBanner from './components/QuickTipBanner';
import SolicitudModal from '@/components/solicitud/SolicitudModal';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function DashboardPage() {
    const [solicitudModalOpen, setSolicitudModalOpen] = useState(false);

    const { user, solicitudes, loadingSolicitudes, ofertas, loadingOfertas, stats } =
        useDashboardData();

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <DashboardHeader
                userName={user?.full_name?.split(' ')[0]}
                onNewSolicitud={() => setSolicitudModalOpen(true)}
            />

            <StatsGrid stats={stats} />

            <div className="grid lg:grid-cols-2 gap-6">
                <RecentQuotationsTable
                    solicitudes={solicitudes}
                    isLoading={loadingSolicitudes}
                    onNewSolicitud={() => setSolicitudModalOpen(true)}
                />
                <OffersOfInterestTable
                    ofertas={ofertas}
                    isLoading={loadingOfertas}
                />
            </div>

            <QuickTipBanner />

            <SolicitudModal
                open={solicitudModalOpen}
                onOpenChange={setSolicitudModalOpen}
            />
        </motion.div>
    );
}
