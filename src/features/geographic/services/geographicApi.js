import apiClient from '@/api/axiosClient';

export const geographicApi = {
    /**
     * GET /countries
     * Returns all available countries on the platform
     */
    async getCountries() {
        return await apiClient.get('/countries');
    },

    /**
     * GET /states/:countryId
     * Returns all states for a specific country
     */
    async getStatesByCountry(countryId) {
        return await apiClient.get(`/states/${countryId}`);
    },

    /**
     * GET /cities/:stateId
     * Returns all cities for a specific state
     */
    async getCitiesByState(stateId) {
        return await apiClient.get(`/cities/${stateId}`);
    }
};
