import apiClient from '@/api/axiosClient';

export const requestsApi = {
    /**
     * POST /requests
     */
    async createRequest(data) {
        return await apiClient.post('/requests', data);
    },

    /**
     * GET /requests/:id
     */
    async getRequestById(id) {
        return await apiClient.get(`/requests/info/${id}`);
    },

    /**
     * GET /requests/company?page=X&limit=Y
     */
    async getCompanyRequests({ page = 1, limit = 10 } = {}) {
        return await apiClient.get('/requests/company', { params: { page, limit } });
    },

    /**
     * PATCH /requests/:id
     */
    async updateRequest(id, data) {
        return await apiClient.patch(`/requests/${id}`, data);
    },

    /**
     * DELETE /requests/:id
     */
    async deleteRequest(id) {
        return await apiClient.delete(`/requests/${id}`);
    },

    /**
     * GET /requests/marketplace?page=X&limit=Y
     * Lists active requests from other companies.
     */
    async getMarketplaceRequests({ page = 1, limit = 10 } = {}) {
        return await apiClient.get('/requests/marketplace', { params: { page, limit } });
    },
};
