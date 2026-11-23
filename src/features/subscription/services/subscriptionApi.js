// src/features/subscription/services/subscriptionApi.js

import apiClient from '@/api/axiosClient';

/** GET /subscriptions/me — effective plan, limits, usage of the month and recent payments. */
export async function getMySubscription() {
    const res = await apiClient.get('/subscriptions/me');
    return res.data;
}

/** GET /subscriptions/plans — active plans with price in USD and Bs. */
export async function getPlans() {
    const res = await apiClient.get('/subscriptions/plans');
    return res.data;
}

/** GET /subscriptions/payment-info — pago movil destination configured by the business. */
export async function getPaymentInfo() {
    const res = await apiClient.get('/subscriptions/payment-info');
    return res.data;
}

/**
 * POST /subscriptions/payments (multipart) — reports a pago movil with its receipt.
 * @param {Object} data - { plan_id, bank_code, payer_phone, payer_document, reference, paid_at }
 * @param {File} receipt
 */
export async function reportPayment(data, receipt) {
    const form = new FormData();
    form.append('payload', JSON.stringify(data));
    form.append('receipt', receipt);
    const res = await apiClient.post('/subscriptions/payments', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}
