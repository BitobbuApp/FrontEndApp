import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Package, DollarSign, CheckCircle, Truck, 
    XCircle, FileText, UploadCloud, AlertTriangle, Loader2, Edit3, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { quoteResponsesApi } from '@/features/requests/services/quoteResponsesApi';
import { transactionsApi } from '@/features/transactions/services/transactionsApi';

const StatusBadge = ({ label, bgColor, textColor }) => (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${bgColor} ${textColor} border border-white border-opacity-20`}>
        {label}
    </span>
);

export default function ChatActionPanel({ selectedConversation, user }) {
    const queryClient = useQueryClient();
    const [actionForm, setActionForm] = useState(null);
    const [formData, setFormData] = useState({});

    // since the chat is B2B. So the actor company ID is cleanly read from the object.
    const myId = user?.companyId || user?.company_id || user?.id;

    // Detect if we are in Phase 1 (Quote) or Phase 2 (Transaction)
    const isQuotePhase = (selectedConversation?.status === 'active' || selectedConversation?.status === 'completed') && !selectedConversation?.transaction_id;
    const isTransactionPhase = (selectedConversation?.status === 'active' || selectedConversation?.status === 'completed') && !!selectedConversation?.transaction_id;
    
    // Auto-fetch Quote Response detail if in quote phase
    const { data: quoteResponse } = useQuery({
        queryKey: ['quote-response-detail', selectedConversation?.quote_response_id],
        queryFn: () => quoteResponsesApi.getQuoteResponseWithSupplier(selectedConversation.quote_response_id),
        enabled: isQuotePhase && !!selectedConversation?.quote_response_id,
    });
    const quoteData = quoteResponse?.data;

    // Auto-fetch Transaction detail if in transaction phase
    const { data: transaction } = useQuery({
        queryKey: ['transaction-detail', selectedConversation?.transaction_id],
        queryFn: () => transactionsApi.getTransactionById(selectedConversation.transaction_id),
        enabled: isTransactionPhase && !!selectedConversation?.transaction_id,
    });

    const quoteMutation = useMutation({
        mutationFn: async ({ action, payload }) => {
            const res = await quoteResponsesApi.performAction(selectedConversation.quote_response_id, { action, payload });
            return res.data;
        },
        onSuccess: (responseData, { action }) => {
            // Optimistic update for acceptance to switch phases immediately
            if (action === 'accepted' && responseData?.transaction_id) {
                queryClient.setQueryData(['conversaciones'], (oldData) => {
                    const rawItems = Array.isArray(oldData) ? oldData : oldData?.data || [];
                    const updatedItems = rawItems.map(conv => {
                        if (conv.id === selectedConversation.id) {
                            return { ...conv, transaction_id: responseData.transaction_id };
                        }
                        return conv;
                    });
                    return Array.isArray(oldData) ? updatedItems : { ...oldData, data: updatedItems };
                });
            }

            queryClient.invalidateQueries({ queryKey: ['quote-response-detail'] });
            queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
            toast.success(`Acción '${action}' ejecutada`);
            setActionForm(null);
            setFormData({});
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error al ejecutar la acción');
        }
    });

    const transactionMutation = useMutation({
        mutationFn: async ({ action, payload }) => {
            const res = await transactionsApi.performAction(selectedConversation.transaction_id, { action, payload });
            return res.data;
        },
        onSuccess: (responseData, { action }) => {
            // Optimistic update for the current user if they triggered delivery_confirmed
            if (action === 'delivery_confirmed') {
                queryClient.setQueryData(['conversaciones'], (oldData) => {
                    const rawItems = Array.isArray(oldData) ? oldData : oldData?.data || [];
                    const updatedItems = rawItems.map(conv => {
                        if (conv.id === selectedConversation.id) {
                            return { ...conv, status: 'pending_review' };
                        }
                        return conv;
                    });
                    return Array.isArray(oldData) ? updatedItems : { ...oldData, data: updatedItems };
                });
            }

            queryClient.invalidateQueries({ queryKey: ['transaction-detail'] });
            queryClient.invalidateQueries({ queryKey: ['conversaciones'] }); // to sync state shift
            toast.success(`Acción '${action}' ejecutada`);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Error al ejecutar logística');
        }
    });

    // Render logic per phase
    if (isQuotePhase && quoteData) {
        const isSupplier = quoteData.supplier_id === myId;
        const isBuyer = !isSupplier; // Only 2 actors

        if (quoteData.status === 'negotiating') {
            return (
                <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-800 text-sm">Fase de Negociación</h4>
                                    <StatusBadge label="En Progreso" bgColor="bg-blue-500" textColor="text-white" />
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Oferta actual: <strong className="text-slate-700">${Number(quoteData.total_amount_usd).toLocaleString()}</strong>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
                            {isSupplier && (
                                <>
                                    {actionForm === 'price' && (
                                        <div className="flex gap-2 items-center bg-white p-1 rounded-md border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2">
                                            <Input type="number" placeholder="Precio ($)" className="w-24 h-8" value={formData.unit_price_usd || ''} onChange={e => setFormData({...formData, unit_price_usd: Number(e.target.value)})} />
                                            <Button size="sm" onClick={() => quoteMutation.mutate({ action: 'price_updated', payload: { unit_price_usd: formData.unit_price_usd }})} disabled={quoteMutation.isPending || !formData.unit_price_usd}>Guardar</Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setActionForm(null)}><X className="w-4 h-4"/></Button>
                                        </div>
                                    )}
                                    {actionForm === 'quantity' && (
                                        <div className="flex gap-2 items-center bg-white p-1 rounded-md border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2">
                                            <Input type="number" placeholder="Cant" className="w-20 h-8" value={formData.quantity || ''} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                                            <Button size="sm" onClick={() => quoteMutation.mutate({ action: 'quantity_updated', payload: { quantity: formData.quantity }})} disabled={quoteMutation.isPending || !formData.quantity}>Guardar</Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setActionForm(null)}><X className="w-4 h-4"/></Button>
                                        </div>
                                    )}
                                    {actionForm === 'terms' && (
                                        <div className="flex gap-2 items-center bg-white p-1 rounded-md border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2">
                                            <Input type="text" placeholder="Notas" className="w-32 h-8" value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} />
                                            <Input type="text" placeholder="Tiempo entrega" className="w-32 h-8" value={formData.delivery_time || ''} onChange={e => setFormData({...formData, delivery_time: e.target.value})} />
                                            <Button size="sm" onClick={() => quoteMutation.mutate({ action: 'terms_updated', payload: { notes: formData.notes, delivery_time: formData.delivery_time }})} disabled={quoteMutation.isPending}>Guardar</Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setActionForm(null)}><X className="w-4 h-4"/></Button>
                                        </div>
                                    )}

                                    {!actionForm && (
                                        <>
                                            <Button size="sm" variant="outline" className="bg-white" onClick={() => setActionForm('price')}><Edit3 className="w-3 h-3 mr-1"/> Precio</Button>
                                            <Button size="sm" variant="outline" className="bg-white" onClick={() => setActionForm('quantity')}><Package className="w-3 h-3 mr-1"/> Cantidad</Button>
                                            <Button size="sm" variant="outline" className="bg-white" onClick={() => setActionForm('terms')}><FileText className="w-3 h-3 mr-1"/> Specs</Button>
                                            <Button size="sm" variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-100 ml-auto" 
                                                    onClick={() => quoteMutation.mutate({ action: 'canceled' })} disabled={quoteMutation.isPending}>
                                                Retirar Oferta
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}
                            {isBuyer && (
                                <>
                                    <Button size="sm" variant="outline" className="border-slate-300"
                                            onClick={() => quoteMutation.mutate({ action: 'formal_quote_requested' })} disabled={quoteMutation.isPending}>
                                        <FileText className="w-4 h-4 mr-1.5" /> Solicitar PDF Formal
                                    </Button>
                                    <Button size="sm" className="bg-[#D2FC31] hover:bg-[#c4ee2a] text-slate-900 border border-[#D2FC31] shadow-none"
                                            onClick={() => quoteMutation.mutate({ action: 'accepted' })} disabled={quoteMutation.isPending}>
                                        <CheckCircle className="w-4 h-4 mr-1.5" /> Aceptar Cotización
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (quoteData.status === 'formal_request_pending') {
            return (
                <div className="bg-amber-50 border-b border-amber-100 p-4 shrink-0 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900 text-sm">Cotización Formal Solicitada</h4>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    {isSupplier 
                                        ? "El comprador requiere un documento PDF oficial para proceder."
                                        : "Esperando que el proveedor envíe el documento oficial..."}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isSupplier ? (
                                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                                        onClick={() => quoteMutation.mutate({ 
                                            action: 'formal_quote_attached', 
                                            payload: { formal_quote_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' } 
                                        })} 
                                        disabled={quoteMutation.isPending}>
                                    <UploadCloud className="w-4 h-4 mr-1.5" /> Generar y Enviar PDF (Simulación)
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2 text-amber-600">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-xs font-medium">Pendiente</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (quoteData.status === 'formal_approval_pending') {
            return (
                <div className="bg-indigo-50 border-b border-indigo-100 p-4 shrink-0 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-900 text-sm">Validación de Cotización</h4>
                                <p className="text-xs text-indigo-700 mt-0.5">
                                    {isSupplier 
                                        ? "Cotización enviada. Esperando aprobación del comprador."
                                        : "El proveedor ha enviado la cotización formal. Favor revisar."}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isBuyer ? (
                                <>
                                    <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 bg-white"
                                            onClick={() => window.open(quoteData.formal_quote_url, '_blank')}>
                                        <FileText className="w-4 h-4 mr-1.5" /> Ver PDF
                                    </Button>
                                    <Button size="sm" variant="destructive" className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                                            onClick={() => quoteMutation.mutate({ action: 'formal_quote_rejected' })} 
                                            disabled={quoteMutation.isPending}>
                                        Rechazar
                                    </Button>
                                    <Button size="sm" className="bg-[#D2FC31] hover:bg-[#c4ee2a] text-slate-900 border border-[#D2FC31]"
                                            onClick={() => quoteMutation.mutate({ action: 'accepted' })} 
                                            disabled={quoteMutation.isPending}>
                                        Aceptar y Pagar
                                    </Button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-xs font-medium">En revisión</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }

    if (isTransactionPhase && transaction) {
        // Evaluate roles from transaction payload
        const isSupplier = transaction.supplier_id === myId;
        const isBuyer = !isSupplier;

        const currentStatus = transaction.status; // pending_payment, payment_review, preparing_order, in_transit, completed

        return (
            <div className="bg-emerald-50 border-b border-emerald-200 p-4 shrink-0 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Truck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-800 text-sm">Fase Logística</h4>
                                <StatusBadge 
                                    label={{
                                        'awaiting_payment': 'ESPERANDO PAGO',
                                        'payment_review': 'PAGO EN REVISIÓN',
                                        'preparing_order': 'PREPARANDO PEDIDO',
                                        'in_transit': 'EN TRÁNSITO',
                                        'completed': 'COMPLETADO',
                                        'canceled': 'CANCELADO',
                                        'in_dispute': 'EN DISPUTA'
                                    }[currentStatus] || currentStatus.toUpperCase().replace('_', ' ')} 
                                    bgColor="bg-emerald-500" 
                                    textColor="text-white" 
                                />
                            </div>
                            <p className="text-xs text-emerald-700 mt-0.5 font-medium">
                                Transacción Activa • {transaction.payment_currency} ${Number(transaction.total_amount_usd).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {currentStatus === 'awaiting_payment' && isBuyer && (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 bg-white"
                                        onClick={() => toast.info("Funcionalidad de carga real próximamente.")}>
                                    Subir Comprobante Real
                                </Button>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                        onClick={() => transactionMutation.mutate({ 
                                            action: 'payment_uploaded',
                                            payload: { payment_proof_url: 'https://bitobbu.com/mock-payment.pdf' }
                                        })} 
                                        disabled={transactionMutation.isPending}>
                                    Subir Pago (Simulación)
                                </Button>
                            </div>
                        )}
                        {currentStatus === 'payment_review' && isSupplier && (
                            <>
                                <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 bg-white"
                                        onClick={() => transactionMutation.mutate({ action: 'payment_rejected' })} disabled={transactionMutation.isPending}>
                                    Rechazar Pago
                                </Button>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={() => transactionMutation.mutate({ action: 'payment_approved' })} disabled={transactionMutation.isPending}>
                                    Aprobar Pago
                                </Button>
                            </>
                        )}
                        {currentStatus === 'preparing_order' && isSupplier && (
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => transactionMutation.mutate({ action: 'order_shipped', payload: { estimated_delivery_date: new Date().toISOString() } })} disabled={transactionMutation.isPending}>
                                Confirmar Envío Activo
                            </Button>
                        )}
                        {currentStatus === 'in_transit' && isBuyer && (
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                    onClick={() => transactionMutation.mutate({ action: 'delivery_confirmed' })} disabled={transactionMutation.isPending}>
                                <CheckCircle className="w-4 h-4 mr-1.5" /> Confirmar Entrega
                            </Button>
                        )}
                        {currentStatus === 'completed' && (
                            <div className="flex items-center gap-2 text-emerald-600 font-bold">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Transacción Finalizada</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
