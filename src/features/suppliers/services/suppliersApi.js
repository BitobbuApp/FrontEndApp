import axiosClient from "@/api/axiosClient";

/**
 * Suppliers API Service
 */
export const suppliersApi = {
    /**
     * GET /companies/:id/reviews
     * Fetches the latest reviews for a specific company.
     */
    getCompanyReviews: async (companyId, limit = 10) => {
        return await axiosClient.get(`/companies/${companyId}/reviews?limit=${limit}`);
    },
};
