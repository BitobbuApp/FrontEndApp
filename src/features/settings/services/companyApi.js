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
        if (data instanceof FormData) {
            return await apiClient.patch(`/companies/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return await apiClient.patch(`/companies/${id}`, data);
    },

    /**
     * POST /companies/:id/verification/documents
     * Sube un documento de verificación KYB.
     */
    async uploadVerificationDocument(companyId, typeId, file) {
        const fd = new FormData();
        fd.append('type_id', String(typeId));
        fd.append('file', file);
        return await apiClient.post(`/companies/${companyId}/verification/documents`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
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
    },

    /**
     * PATCH /companies/:id/settings
     * Company-wide settings. `two_factor_required` makes every user of the company set up 2FA.
     * Only a user of that company can change it.
     */
    async updateCompanySettings(id, data) {
        return await apiClient.patch(`/companies/${id}/settings`, data, { silent: true });
    },

    /**
     * GET /companies?page=X&limit=Y&sector=Z&interest=W
     * Lists companies with pagination and optional filters.
     */
    async listCompanies({ page = 1, limit = 10, sector, interest } = {}) {
        const params = { page, limit };
        if (sector) params.sector = sector;
        if (interest) params.interest = interest;
        return await apiClient.get('/companies', { params });
    },
};
