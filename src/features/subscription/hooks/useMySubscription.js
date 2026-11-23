import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMySubscription, getPaymentInfo, getPlans, reportPayment } from '../services/subscriptionApi';

export const MY_SUBSCRIPTION_QUERY_KEY = ['subscription', 'me'];

/** Single source of truth for the company's plan, limits and usage. */
export function useMySubscription({ enabled = true } = {}) {
    return useQuery({
        queryKey: MY_SUBSCRIPTION_QUERY_KEY,
        queryFn: getMySubscription,
        enabled,
        staleTime: 60_000,
    });
}

export function usePlans() {
    return useQuery({ queryKey: ['subscription', 'plans'], queryFn: getPlans, staleTime: 5 * 60_000 });
}

export function usePaymentInfo() {
    return useQuery({ queryKey: ['subscription', 'payment-info'], queryFn: getPaymentInfo, staleTime: 5 * 60_000 });
}

export function useReportPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data, receipt }) => reportPayment(data, receipt),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MY_SUBSCRIPTION_QUERY_KEY });
            toast.success('Pago reportado. Te avisaremos cuando sea verificado.');
        },
        onError: (error) => {
            // 404/409/5xx already show a toast from the API client
            const status = error?.response?.status;
            if (status === 400 || status === 422) toast.error(error.normalizedError?.message || 'Revisa los datos del pago');
        },
    });
}

/** True for plans without monthly price (the default "Gratis" plan). */
export const isFreePlan = (plan) => !plan || Number(plan.price ?? plan.price_usd ?? 0) === 0;

export const planLabel = (plan) => plan?.name_es || plan?.name || 'Gratis';
