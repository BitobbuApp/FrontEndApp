import apiClient from '@/api/axiosClient';

export const appMetadataApi = {
    /**
     * GET /metadata/app
     */
    async getAppMetadata() {
        return await apiClient.get('/metadata/app');
    },

    async getCountries() {
        return await apiClient.get('/countries');
    },

    async getStates(countryId = 1) {
        return await apiClient.get(`/states/${countryId}`);
    },

    async getCities(stateId) {
        return await apiClient.get(`/cities/${stateId}`);
    },

    async getDeliveryMethods(countryId = 1) {
        return await apiClient.get(`/delivery-methods/${countryId}`);
    },
};
