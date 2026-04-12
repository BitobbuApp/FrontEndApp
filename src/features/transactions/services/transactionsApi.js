import apiClient from '@/api/axiosClient';

export const transactionsApi = {
  createTransaction: async (data) => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },
  getTransactionById: async (id) => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },
  performAction: async (id, payload) => {
    const response = await apiClient.post(`/transactions/${id}/action`, payload);
    return response.data;
  },
};
