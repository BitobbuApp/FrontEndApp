import apiClient from '@/api/axiosClient';

/**
 * API service for Products / Catalog operations.
 */
export const productsApi = {
    /**
     * POST /company-offers
     * Creates a new product or service linked to the authenticated company.
     */
    async createProduct(data) {
        return await apiClient.post('/company-offers', data);
    },

    /**
     * GET /company-offers/company/:id
     * Lists products for a given company.
     */
    async getProductsByCompany(companyId) {
        return await apiClient.get(`/company-offers/company/${companyId}`);
    },

    /**
     * PATCH /company-offers/:id
     */
    async updateProduct(id, data) {
        return await apiClient.patch(`/company-offers/${id}`, data);
    },

    /**
     * DELETE /company-offers/:id
     */
    async deleteProduct(id) {
        return await apiClient.delete(`/company-offers/${id}`);
    },
};
