import React from 'react';
import { Star, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/**
 * CompanyProfileCard
 * @param {object} company - Company data (name, initials, rating, logo_url, etc.)
 * @param {array} metrics - Array of { label, value } for progress bars
 * @param {array} infoBlocks - Array of { icon, label, value } for metadata
 * @param {React.ReactNode} action - Slot for a button or link (e.g., "Ver perfil")
 * @param {function} onReviewClick - Action when clicking review count
 */
export default function CompanyProfileCard({
    company = {},
    metrics = [],
    infoBlocks = [],
    action,
    onReviewClick
}) {
    const initials = company.trade_name?.[0]?.toUpperCase() || 'C';
    const rating = Number(company.average_rating) || 0;
    const reviewCount = company.review_count || 0;

    return (
        <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
                {/* --- Main Identity --- */}
                <div className="text-center group">
                    <div className="inline-flex w-20 h-20 bg-[#D2FC31] rounded-3xl items-center justify-center text-slate-900 text-2xl font-black shadow-inner mb-4 transition-transform group-hover:scale-105 duration-300 overflow-hidden">
                        {company.logo_url ? (
                            <img src={company.logo_url} alt={company.trade_name} className="h-full w-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
                        {company.trade_name || 'Empresa'}
                        <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
                    </h3>

                    {/* Rating HUD */}
                    <div className="flex items-center justify-center gap-1.5 mt-2.5">
                        <div className="flex items-center mr-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    className={cn(
                                        "w-3.5 h-3.5",
                                        star <= Math.floor(rating) 
                                            ? "fill-amber-400 text-amber-400" 
                                            : "fill-slate-100 text-slate-200"
                                    )} 
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{rating.toFixed(1)}</span>
                        
                        {onReviewClick && (
                            <button 
                                onClick={onReviewClick}
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest ml-2 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-600 transition-all"
                            >
                                {reviewCount} Reseñas
                            </button>
                        )}
                    </div>

                    {action && (
                        <div className="mt-3">
                            {action}
                        </div>
                    )}
                </div>

                {/* --- Detailed Metrics (Progress Bars) --- */}
                {metrics.length > 0 && (
                    <div className="space-y-4 py-5 border-y border-slate-50">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] px-1">
                            Calificación Detallada
                        </p>
                        <div className="space-y-3.5">
                            {metrics.map((metric, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                                        <span>{metric.label}</span>
                                        <span className="text-slate-900">{Number(metric.value).toFixed(1)}</span>
                                    </div>
                                    <Progress value={metric.value * 20} className="h-1 bg-slate-50" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Metadata Blocks (Location, Sector, etc.) --- */}
                <div className="space-y-6 pt-2">
                    {infoBlocks.map((block, idx) => (
                        <div key={idx} className="flex flex-col items-center md:items-start gap-2 group px-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-slate-500 transition-colors">
                                <span className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#D2FC31]/20 group-hover:text-slate-600 transition-all">
                                    {block.icon}
                                </span>
                                {block.label}
                            </p>
                            <p className="text-sm font-semibold text-slate-800 ml-0 md:ml-9">
                                {block.value || 'No especificado'}
                            </p>
                        </div>
                    ))}

                    {/* Bio Section */}
                    {company.bio && (
                        <div className="space-y-2.5 px-1 pt-2 border-t border-slate-50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3.5 h-3.5" /> Biografía
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                                "{company.bio}"
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
