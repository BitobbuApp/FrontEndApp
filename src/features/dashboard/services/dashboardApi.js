import axiosClient from "@/api/axiosClient";

/**
 * GET /dashboard/stats
 * Retrieves metrics for both Buyer and Supplier roles.
 */
export const getDashboardStats = async () => {
    return await axiosClient.get('/dashboard/stats');
};
