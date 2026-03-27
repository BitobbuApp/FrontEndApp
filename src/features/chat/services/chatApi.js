import apiClient from '@/api/axiosClient';

export const chatApi = {
    getConversations: async () => {
        const response = await apiClient.get('/conversations');
        return response.data; 
    },
    getMessages: async (conversationId) => {
        const response = await apiClient.get(`/messages/${conversationId}`);
        return response.data;
    }
};
