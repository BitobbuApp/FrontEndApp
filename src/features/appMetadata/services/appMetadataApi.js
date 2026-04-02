import apiClient from '@/api/axiosClient';

export const appMetadataApi = {
    /**
     * GET /metadata/app
     */
    async getAppMetadata() {
        return await apiClient.get('/metadata/app');
    },
};
