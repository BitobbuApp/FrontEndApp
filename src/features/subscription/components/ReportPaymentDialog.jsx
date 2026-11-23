import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VE_BANKS } from '../constants/banks';
import { usePaymentInfo, useReportPayment, planLabel } from '../hooks/useMySubscription';

const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;
const ACCEPTED = 'image/jpeg,image/png,image/webp,application/pdf';

const formatVes = (value) =>
    value === null || value === undefined
        ? null
        : `Bs. ${Number(value).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;

const today = () => new Date().toISOString().slice(0, 10);

function Row({ label, value }) {
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground text-right">{value || '—'}</span>
        </div>
    );
}

export default function ReportPaymentDialog({ plan, open, onOpenChange }) {
    const { data: info } = usePaymentInfo();
    const report = useReportPayment();
    const [form, setForm] = useState({ bank_code: '', payer_phone: '', payer_document: '', reference: '', paid_at: today() });
    const [receipt, setReceipt] = useState(null);
    const [error, setError] = useState('');

    const set = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

    const close = () => {
        setError('');
        setReceipt(null);
        onOpenChange(false);
    };

    const submit = () => {
        setError('');
        if (!form.bank_code) return setError('Selecciona el banco desde el que pagaste');
        if (!/^0?4\d{9}$/.test(form.payer_phone.replace(/\D/g, ''))) return setError('Teléfono inválido (ej. 04141234567)');
        if (!/^[VEJGP]-?\d{5,10}$/i.test(form.payer_document.trim())) return setError('Cédula o RIF inválido (ej. V-12345678)');
        if (!/^\d{4,20}$/.test(form.reference.trim())) return setError('La referencia solo admite números');
        if (!receipt) return setError('Adjunta el comprobante del pago');
        if (receipt.size > MAX_RECEIPT_BYTES) return setError('El comprobante no puede superar 5 MB');

        report.mutate(
            {
                data: {
                    plan_id: plan.id,
                    bank_code: form.bank_code,
                    payer_phone: form.payer_phone.replace(/\D/g, ''),
                    payer_document: form.payer_document.trim().toUpperCase(),
                    reference: form.reference.trim(),
                    paid_at: form.paid_at,
                },
                receipt,
            },
            { onSuccess: close, onError: (err) => setError(err.normalizedError?.message || err.userMessage || 'No se pudo reportar el pago') }
        );
    };

    if (!plan) return null;

    return (
        <Dialog open={open} onOpenChange={(value) => (value ? onOpenChange(true) : close())}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Pagar plan {planLabel(plan)}</DialogTitle>
                    <DialogDescription>
                        Haz un pago móvil con estos datos y luego reporta la referencia y el comprobante.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 rounded-xl bg-muted/50 p-4">
                    <Row label="Monto" value={formatVes(plan.price_ves) ?? `$${plan.price_usd}`} />
                    {plan.price_ves !== null && <Row label="Equivalente" value={`$${plan.price_usd}`} />}
                    <Row label="Banco" value={info?.bank} />
                    <Row label="Teléfono" value={info?.phone} />
                    <Row label="Cédula / RIF" value={info?.document_id} />
                    <Row label="Titular" value={info?.holder_name} />
                </div>

                <div className="grid gap-3">
                    <div className="space-y-1">
                        <Label>Banco desde el que pagaste</Label>
                        <Select value={form.bank_code} onValueChange={(value) => setForm((prev) => ({ ...prev, bank_code: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona tu banco" />
                            </SelectTrigger>
                            <SelectContent>
                                {VE_BANKS.map((bank) => (
                                    <SelectItem key={bank.code} value={bank.code}>
                                        {bank.code} · {bank.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Label>Teléfono del pagador</Label>
                            <Input inputMode="tel" placeholder="04141234567" value={form.payer_phone} onChange={set('payer_phone')} />
                        </div>
                        <div className="space-y-1">
                            <Label>Cédula o RIF del pagador</Label>
                            <Input placeholder="V-12345678" value={form.payer_document} onChange={set('payer_document')} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Label>Número de referencia</Label>
                            <Input inputMode="numeric" placeholder="123456" value={form.reference} onChange={set('reference')} />
                        </div>
                        <div className="space-y-1">
                            <Label>Fecha del pago</Label>
                            <Input type="date" max={today()} value={form.paid_at} onChange={set('paid_at')} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>Comprobante (imagen o PDF, máx. 5 MB)</Label>
                        <Input type="file" accept={ACCEPTED} onChange={(event) => setReceipt(event.target.files?.[0] ?? null)} />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={close} disabled={report.isPending}>
                        Cancelar
                    </Button>
                    <Button
                        className="bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]"
                        onClick={submit}
                        disabled={report.isPending}
                    >
                        {report.isPending ? 'Enviando...' : 'Reportar pago'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
