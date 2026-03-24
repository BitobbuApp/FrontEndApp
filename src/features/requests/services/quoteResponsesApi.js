import apiClient from '@/api/axiosClient';

export const quoteResponsesApi = {
    /**
     * POST /quote-responses/
     * Create a new quote response for an RFQ
     */
    async createQuoteResponse(data) {
        return await apiClient.post('/quote-responses', data);
    },

    /**
     * GET /quote-responses/company
     * List quote responses created by the current company
     */
    async getCompanyQuoteResponses({ page = 1, limit = 10 } = {}) {
        return await apiClient.get('/quote-responses/company', { params: { page, limit } });
    },

    /**
     * GET /quote-responses/received
     * List quote responses received for the current company's own requests
     */
    async getReceivedQuoteResponses({ page = 1, limit = 10 } = {}) {
        return await apiClient.get('/quote-responses/received', { params: { page, limit } });
    },

    /**
     * GET /quote-responses/:id
     * Fetch the details of a specific quote response
     */
    async getQuoteResponseById(id) {
        return await apiClient.get(`/quote-responses/${id}`);
    },

    /**
     * PATCH /quote-responses/:id
     * Update an existing quote response
     */
    async updateQuoteResponse(id, data) {
        return await apiClient.patch(`/quote-responses/${id}`, data);
    },

    /**
     * DELETE /quote-responses/:id
     * Remove a quote response
     */
    async deleteQuoteResponse(id) {
        return await apiClient.delete(`/quote-responses/${id}`);
    },
};
