import apiClient from '@/api/axiosClient';

export const reviewsApi = {
    /**
     * POST /reviews/:transactionId/evaluate-supplier
     * Submit a review as a buyer evaluating the supplier
     */
    async evaluateSupplier(transactionId, data) {
        return await apiClient.post(`/reviews/${transactionId}/evaluate-supplier`, data);
    },

    /**
     * POST /reviews/:transactionId/evaluate-buyer
     * Submit a review as a supplier evaluating the buyer
     */
    async evaluateBuyer(transactionId, data) {
        return await apiClient.post(`/reviews/${transactionId}/evaluate-buyer`, data);
    },
};
