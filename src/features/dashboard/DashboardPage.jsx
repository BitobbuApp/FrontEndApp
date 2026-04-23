import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useDashboardData from './hooks/useDashboardData';
import DashboardHeader from './components/DashboardHeader';
import StatsGrid from './components/StatsGrid';
import RecentQuotationsTable from './components/RecentQuotationsTable';
import OffersOfInterestTable from './components/OffersOfInterestTable';
import RecentTransactionsTable from './components/RecentTransactionsTable';
import QuickTipBanner from './components/QuickTipBanner';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function DashboardPage() {
    const navigate = useNavigate();

    const { 
        user, company, transactions, loadingTransactions, 
        transPage, transTotalPages, transTotalItems, setTransPage, 
        stats 
    } = useDashboardData();

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <DashboardHeader
                userName={user?.full_name?.split(' ')[0]}
                onNewSolicitud={() => navigate('/Requests/new')}
                canBuy={company?.can_buy}
            />

            <StatsGrid stats={stats} company={company} />

            <RecentTransactionsTable
                transactions={transactions}
                isLoading={loadingTransactions}
                companyId={company?.id}
                currentPage={transPage}
                totalPages={transTotalPages}
                totalItems={transTotalItems}
                onPageChange={setTransPage}
            />

            <QuickTipBanner />
        </motion.div>
    );
}
