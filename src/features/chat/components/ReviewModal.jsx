import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { Star, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { reviewsApi } from '@/features/requests/services/reviewsApi';
import { transactionsApi } from '@/features/transactions/services/transactionsApi';

// Reusable Star Rater component
const StarRater = ({ label, value, onChange }) => {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <Star
                            className={`w-6 h-6 ${
                                star <= value 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'fill-transparent text-slate-300'
                            }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function ReviewModal({ selectedConversation, user }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const [scores, setScores] = useState({
        score_quality: 0,
        score_compliance: 0,
        score_communication: 0,
        score_price: 0,
        score_reliability: 0,
    });
    const [comment, setComment] = useState('');

    const isMobile = useIsMobile();



    // Determine the role. The only robust way is fetching the transaction OR relying on participant IDs
    // Assuming participant_1 is buyer? No, Quote generator is buyer.
    // For now, let's use the UI's assumption: 
    // If quoteResponse is accessible, we can check. 
    // Wait, better yet, `selectedConversation` doesn't inherently say who the buyer is unless we know `buyer_id` vs `supplier_id` on the transaction/quote.
    // However, if we evaluate based on `transaction`, we need to fetch it.
    
    // We can assume that if `selectedConversation.status === 'pending_review'` we should show this.
    const isVisible = selectedConversation?.status === 'pending_review';

    const { data: transaction, isLoading } = useQuery({
        queryKey: ['transaction-detail', selectedConversation?.transaction_id],
        queryFn: () => transactionsApi.getTransactionById(selectedConversation.transaction_id),
        enabled: isVisible && !!selectedConversation?.transaction_id,
    });

    const myCompanyId = user?.companyId || user?.company_id || user?.id;
    const isSupplier = transaction?.supplier_id === myCompanyId;

    const submitMutation = useMutation({
        mutationFn: async (payload) => {
            if (isSupplier) {
                const res = await reviewsApi.evaluateBuyer(selectedConversation.transaction_id, payload);
                return res.data;
            } else {
                const res = await reviewsApi.evaluateSupplier(selectedConversation.transaction_id, payload);
                return res.data;
            }
        },
        onSuccess: () => {
            toast.success('Evaluación enviada con éxito. ¡Gracias!');
            queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error al enviar evaluación');
        }
    });

    useEffect(() => {
        if (submitMutation.isSuccess && isMobile) {
            const timer = setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [submitMutation.isSuccess, navigate, isMobile]);

    if (!isVisible) return null;

    if (isLoading) {
        return (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#D2FC31] animate-spin" />
            </div>
        );
    }

    if (submitMutation.isSuccess) {
        return (
            <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">Evaluación Enviada</h3>
                <p className="text-slate-500 mt-2">Esperando a que la otra parte envíe su calificación para cerrar el proceso.</p>
            </div>
        );
    }

    const handleSubmit = () => {
        const payload = {
            comment,
            is_public: true
        };

        if (isSupplier) {
            // Supplier evaluates Buyer (3 fields)
            payload.score_compliance = scores.score_compliance;
            payload.score_communication = scores.score_communication;
            payload.score_reliability = scores.score_reliability;
        } else {
            // Buyer evaluates Supplier (4 fields)
            payload.score_quality = scores.score_quality;
            payload.score_compliance = scores.score_compliance;
            payload.score_communication = scores.score_communication;
            payload.score_price = scores.score_price;
        }

        submitMutation.mutate(payload);
    };

    const isComplete = isSupplier 
        ? (scores.score_compliance > 0 && scores.score_communication > 0 && scores.score_reliability > 0)
        : (scores.score_quality > 0 && scores.score_compliance > 0 && scores.score_communication > 0 && scores.score_price > 0);

    return (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col p-6 animate-in fade-in slide-in-from-bottom-10">
            <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Calificar a {isSupplier ? 'el Comprador' : 'el Proveedor'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Tu evaluación ayuda a mantener la confianza en la red B2B.
                    </p>
                </div>

                <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 mb-4">
                    {isSupplier ? (
                        <>
                            <StarRater label="Cumplimiento de Tratos" value={scores.score_compliance} onChange={v => setScores({...scores, score_compliance: v})} />
                            <StarRater label="Comunicación" value={scores.score_communication} onChange={v => setScores({...scores, score_communication: v})} />
                            <StarRater label="Confiabilidad de Pago" value={scores.score_reliability} onChange={v => setScores({...scores, score_reliability: v})} />
                        </>
                    ) : (
                        <>
                            <StarRater label="Calidad del Producto" value={scores.score_quality} onChange={v => setScores({...scores, score_quality: v})} />
                            <StarRater label="Cumplimiento y Tiempos" value={scores.score_compliance} onChange={v => setScores({...scores, score_compliance: v})} />
                            <StarRater label="Comunicación" value={scores.score_communication} onChange={v => setScores({...scores, score_communication: v})} />
                            <StarRater label="Relación Precio/Valor" value={scores.score_price} onChange={v => setScores({...scores, score_price: v})} />
                        </>
                    )}
                    
                    <div className="pt-4 border-t border-slate-100">
                        <label className="text-sm font-semibold text-slate-700 block mb-2">Comentarios (Opcional)</label>
                        <textarea 
                            className="w-full border-slate-200 rounded-xl p-3 text-sm focus:ring-[#D2FC31]"
                            rows="3"
                            placeholder="¿Cómo fue tu experiencia trabajando con esta empresa?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>

                <Button 
                    className="w-full h-12 rounded-xl bg-[#D2FC31] hover:bg-[#c4ed2d] text-slate-900 font-bold"
                    onClick={handleSubmit}
                    disabled={!isComplete || submitMutation.isPending}
                >
                    {submitMutation.isPending ? 'Enviando...' : 'Enviar Evaluación'}
                </Button>
            </div>
        </div>
    );
}
