import axiosClient from "@/api/axiosClient";

/**
 * Suppliers API Service
 */
export const suppliersApi = {
    /**
     * GET /companies/:id/reviews
     * Fetches the latest reviews for a specific company.
     */
    getCompanyReviews: async (companyId, page = 1, limit = 10) => {
        return await axiosClient.get(`/companies/${companyId}/reviews?page=${page}&limit=${limit}`);
    },
};
