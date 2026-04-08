import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
    },
};

/**
 * DetailLayout
 * @param {string} title - Page title
 * @param {string} subtitle - Optional small text above title
 * @param {function} onBack - Action when back button is clicked
 * @param {React.ReactNode} headerActions - Buttons for the header (e.g. "Cotizar")
 * @param {React.ReactNode} sidebar - Content for the right column
 * @param {React.ReactNode} footerActions - Optional footer button bar
 * @param {string} className - Additional classes for the main content
 */
export default function DetailLayout({
    title,
    subtitle,
    onBack,
    headerActions,
    sidebar,
    footerActions,
    children,
    className
}) {
    return (
        <motion.div
            className="max-w-6xl mx-auto space-y-6 pb-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* --- Header / Navigation --- */}
            <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="rounded-full hover:bg-slate-100 flex-shrink-0"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                    )}
                    <div>
                        {subtitle && (
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 mb-0.5">
                                {subtitle}
                            </p>
                        )}
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                            {title}
                        </h1>
                    </div>
                </div>

                {headerActions && (
                    <div className="flex items-center gap-3">
                        {headerActions}
                    </div>
                )}
            </motion.header>

            {/* --- Main Content Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left/Center Column */}
                <motion.div variants={itemVariants} className={cn("lg:col-span-2 space-y-6", className)}>
                    {children}
                    
                    {footerActions && (
                        <div className="flex gap-4 pt-4">
                            {footerActions}
                        </div>
                    )}
                </motion.div>

                {/* Sidebar (Right) */}
                <motion.aside variants={itemVariants} className="space-y-6">
                    {sidebar}
                </motion.aside>
            </div>
        </motion.div>
    );
}
