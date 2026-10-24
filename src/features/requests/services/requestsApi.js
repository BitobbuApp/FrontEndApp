import apiClient from '@/api/axiosClient';

export const requestsApi = {
    /**
     * POST /requests
     */
    async createRequest(data) {
        if (data instanceof FormData) {
            return await apiClient.post('/requests', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
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
     * GET /requests/marketplace?page=X&limit=Y&category_id=Z&subcategory_ids=1,2
     * Lists active requests from other companies (filtered in the backend).
     */
    async getMarketplaceRequests({ page = 1, limit = 10, category_id, subcategory_ids } = {}) {
        return await apiClient.get('/requests/marketplace', {
            params: {
                page,
                limit,
                ...(category_id && { category_id }),
                ...(subcategory_ids?.length && { subcategory_ids: subcategory_ids.join(',') }),
            },
        });
    },
};
