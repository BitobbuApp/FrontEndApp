import apiClient from '@/api/axiosClient';

/**
 * API service for Company-related operations in Bitobbu.
 */
export const companyApi = {
    /**
     * POST /companies
     * Creates a new company for the authenticated user.
     */
    async createCompany(data) {
        return await apiClient.post('/companies', data);
    },

    /**
     * PATCH /companies/:id
     * Updates an existing company.
     */
    async updateCompany(id, data) {
        return await apiClient.patch(`/companies/${id}`, data);
    },

    /**
     * GET /companies/:id
     */
    async getCompanyById(id) {
        return await apiClient.get(`/companies/${id}`);
    },

    /**
     * GET /companies/me (Hypothetical, or use filter)
     */
    async getMyCompany() {
        // This might change depending on the actual endpoint for getting the user's company
        return await apiClient.get('/companies/me');
    }
};
