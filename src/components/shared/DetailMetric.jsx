import React from 'react';
import { cn } from '@/lib/utils';

/**
 * DetailMetric
 * @param {LucideIcon} icon - Lucide-react icon component
 * @param {string} label - Label text
 * @param {string|number} value - Value text
 * @param {boolean} accent - If true, adds an accent background
 */
export default function DetailMetric({ 
    icon: Icon, 
    label, 
    value, 
    accent = false 
}) {
    return (
        <div className={cn(
            'flex flex-col p-4 rounded-2xl border transition-all duration-200 group',
            accent 
                ? 'bg-[#D2FC31]/10 border-[#D2FC31]/40 hover:bg-[#D2FC31]/20' 
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
        )}>
            <div className="flex items-center gap-2 mb-2">
                {Icon && (
                    <Icon className={cn(
                        'w-3.5 h-3.5',
                        accent ? 'text-[#aacc27]' : 'text-slate-400 group-hover:text-slate-600'
                    )} />
                )}
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-500 transition-colors">
                    {label}
                </span>
            </div>
            <div className={cn(
                "text-sm font-semibold truncate",
                accent ? "text-slate-900" : "text-slate-800"
            )}>
                {value}
            </div>
        </div>
    );
}
