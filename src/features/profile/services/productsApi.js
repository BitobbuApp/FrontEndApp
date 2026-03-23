import apiClient from '@/api/axiosClient';

/**
 * API service for Products / Catalog operations.
 */
export const productsApi = {
    /**
     * POST /products
     * Creates a new product or service linked to the authenticated company.
     */
    async createProduct(data) {
        return await apiClient.post('/products', data);
    },

    /**
     * GET /products?company_id=xxx
     * Lists products for a given company.
     */
    async getProductsByCompany(companyId) {
        return await apiClient.get('/products', { params: { company_id: companyId } });
    },

    /**
     * PATCH /products/:id
     */
    async updateProduct(id, data) {
        return await apiClient.patch(`/products/${id}`, data);
    },

    /**
     * DELETE /products/:id
     */
    async deleteProduct(id) {
        return await apiClient.delete(`/products/${id}`);
    },
};
