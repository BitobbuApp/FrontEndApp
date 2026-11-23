import React, { useState } from 'react';
import { Check, BadgeCheck, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ReportPaymentDialog from '@/features/subscription/components/ReportPaymentDialog';
import {
    useMySubscription,
    usePlans,
    isFreePlan,
    planLabel,
} from '@/features/subscription/hooks/useMySubscription';

const formatDate = (date) => (date ? new Date(date).toLocaleDateString('es-VE') : null);
// The API returns the first instant after the free period, so the last included day is one ms earlier.
const formatLastDay = (endExclusive) => formatDate(new Date(new Date(endExclusive).getTime() - 1));
const formatVes = (value) =>
    value === null || value === undefined ? null : `Bs. ${Number(value).toLocaleString('es-VE', { maximumFractionDigits: 2 })}`;

const PAYMENT_STATUS = {
    pending: { label: 'En revisión', className: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Aprobado', className: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Rechazado', className: 'bg-red-100 text-red-700' },
};

const limitText = (value, unit) => (value === null || value === undefined ? `${unit} ilimitadas` : `${value} ${unit}`);

function UsageBar({ label, used, limit }) {
    const unlimited = limit === null || limit === undefined;
    const pct = unlimited ? 0 : Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-slate-600">{label}</span>
                <span className="font-medium text-foreground">
                    {used} / {unlimited ? '∞' : limit}
                </span>
            </div>
            {!unlimited && <Progress value={pct} className={`h-1.5 ${pct >= 100 ? '[&>div]:bg-red-500' : ''}`} />}
        </div>
    );
}

export default function SubscriptionTab() {
    const { data: sub, isLoading } = useMySubscription();
    const { data: catalog } = usePlans();
    const [payingPlan, setPayingPlan] = useState(null);

    if (isLoading || !sub) {
        return <p className="text-sm text-muted-foreground">Cargando tu plan...</p>;
    }

    const isFree = isFreePlan(sub.plan);
    const pendingPayment = sub.payments?.find((p) => p.status === 'pending');
    const periodEnd = formatDate(sub.subscription?.current_period_end);
    const plans = catalog?.plans ?? [];

    return (
        <div className="space-y-6">
            <Card className={`border-2 ${isFree ? 'border-border' : 'border-[#D2FC31]'}`}>
                <CardContent className="p-6 space-y-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isFree ? 'bg-slate-100' : 'bg-[#D2FC31]'}`}>
                                <BadgeCheck className={`w-8 h-8 ${isFree ? 'text-slate-400' : 'text-foreground'}`} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Plan {planLabel(sub.plan)}</h3>
                                {sub.free_unlimited_until ? (
                                    <Badge className="bg-[#1E293B] text-white mt-1">
                                        Uso ilimitado hasta el {formatLastDay(sub.free_unlimited_until)}
                                    </Badge>
                                ) : periodEnd ? (
                                    <p className={`text-sm mt-1 ${sub.in_grace ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                                        {sub.in_grace ? `Venció el ${periodEnd}: renueva para no volver a Gratis` : `Vigente hasta el ${periodEnd}`}
                                    </p>
                                ) : (
                                    <p className="text-sm text-slate-500 mt-1">Sin vencimiento</p>
                                )}
                            </div>
                        </div>
                        {pendingPayment && (
                            <Badge className="bg-amber-100 text-amber-700 gap-1 self-start sm:self-center">
                                <Clock className="w-3.5 h-3.5" />
                                Pago en revisión (ref. {pendingPayment.reference})
                            </Badge>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <UsageBar label="Cotizaciones este mes" used={sub.usage.quotes_this_month} limit={sub.limits.quotes_per_month} />
                        <UsageBar label="Ofertas activas" used={sub.usage.active_offers} limit={sub.limits.active_offers} />
                    </div>
                </CardContent>
            </Card>

            {!sub.payments_enabled && (
                <p className="rounded-xl bg-muted/50 p-4 text-sm text-slate-600">
                    Por ahora no estamos recibiendo pagos: disfruta tu plan actual. Te avisaremos cuando puedas cambiar de plan.
                </p>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => {
                    const isCurrent = plan.id === sub.plan.id;
                    const free = isFreePlan(plan);
                    return (
                        <Card key={plan.id} className={`shadow-sm ${isCurrent ? 'border-2 border-[#D2FC31]' : 'border-0'}`}>
                            <CardContent className="p-6 flex h-full flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-foreground">{planLabel(plan)}</h4>
                                    {isCurrent && <Badge className="bg-[#D2FC31] text-slate-900">Tu plan</Badge>}
                                </div>
                                <ul className="space-y-3 text-sm flex-1">
                                    <li className="flex items-center gap-2 text-slate-600">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        {limitText(plan.max_quotes_per_month, 'cotizaciones')} por mes
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-600">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        {limitText(plan.max_active_offers, 'ofertas')} activas
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-600">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        Solicitudes de compra ilimitadas
                                    </li>
                                </ul>
                                <div className="mt-4">
                                    <p className="text-2xl font-bold text-foreground">
                                        ${plan.price_usd}
                                        <span className="text-sm font-normal text-slate-500">/{plan.billing_cycle} días</span>
                                    </p>
                                    {!free && formatVes(plan.price_ves) && (
                                        <p className="text-sm text-slate-500">{formatVes(plan.price_ves)} a tasa del día</p>
                                    )}
                                </div>
                                {!free && sub.payments_enabled && (
                                    <Button
                                        className="mt-4 bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d]"
                                        disabled={!!pendingPayment}
                                        onClick={() => setPayingPlan(plan)}
                                    >
                                        {isCurrent ? 'Renovar' : `Pasar a ${planLabel(plan)}`}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {sub.payments?.length > 0 && (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <h4 className="font-semibold text-foreground mb-4">Pagos reportados</h4>
                        <ul className="divide-y text-sm">
                            {sub.payments.map((payment) => (
                                <li key={payment.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {planLabel(payment.plan)} · ref. {payment.reference}
                                        </p>
                                        <p className="text-slate-500">
                                            {formatDate(payment.paid_at)} · {formatVes(payment.amount_ves) ?? `$${payment.amount_usd}`}
                                        </p>
                                        {payment.rejection_reason && <p className="text-red-600">{payment.rejection_reason}</p>}
                                    </div>
                                    <Badge className={`${PAYMENT_STATUS[payment.status]?.className} self-start sm:self-center`}>
                                        {PAYMENT_STATUS[payment.status]?.label ?? payment.status}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            <ReportPaymentDialog plan={payingPlan} open={!!payingPlan} onOpenChange={(open) => !open && setPayingPlan(null)} />
        </div>
    );
}
