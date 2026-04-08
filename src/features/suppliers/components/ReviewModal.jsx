import React from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog";
import { Star, MessageSquare, Loader2, User } from 'lucide-react';
import { useSupplierReviews } from '../hooks/useSupplierReviews';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ReviewModal({ 
    open, 
    onOpenChange, 
    companyId, 
    companyName,
    typeLabel = 'proveedor' 
}) {
    const { reviews, loading } = useSupplierReviews(companyId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
                    <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        Calificaciones de {companyName || 'Empresa'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Últimas 10 reseñas recibidas
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 bg-white">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            <p className="text-sm font-medium text-slate-500">Cargando reseñas...</p>
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {review.author?.trade_name || 'Empresa Anónima'}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                {review.created_at ? format(new Date(review.created_at), 'd MMM yyyy', { locale: es }) : 'Reciente'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star 
                                                key={s} 
                                                className={`w-3 h-3 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed italic">
                                    "{review.comment || 'Sin comentarios adicionales.'}"
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center px-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-slate-300" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Sin reseñas aún</p>
                                <p className="text-xs text-slate-500 mt-1">Este {typeLabel} todavía no ha recibido calificaciones.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={() => onOpenChange(false)}
                        className="px-6 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
