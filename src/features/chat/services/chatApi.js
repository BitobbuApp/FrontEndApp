import apiClient from '@/api/axiosClient';

export const chatApi = {
    getConversations: async () => {
        const response = await apiClient.get('/conversations');
        return response.data; 
    },
    getMessages: async (conversationId) => {
        const response = await apiClient.get(`/messages/${conversationId}`);
        return response.data;
    },
    uploadFile: async (formData) => {
        return await apiClient.post('/messages/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
