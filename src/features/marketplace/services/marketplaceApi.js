import apiClient from '@/api/axiosClient';

export const marketplaceApi = {
    /**
     * GET /company-offers/marketplace
     * Public endpoint to fetch marketplace products.
     */
    async getMarketplaceOffers(params) {
        return await apiClient.get('/company-offers/marketplace', { params });
    },
};
