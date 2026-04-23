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
  performAction: async (id, { action, payload, file }) => {
    if (file) {
      const fd = new FormData();
      fd.append('action', action);
      if (payload) fd.append('payload', JSON.stringify(payload));
      fd.append('file', file);
      const response = await apiClient.post(`/transactions/${id}/action`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    const response = await apiClient.post(`/transactions/${id}/action`, { action, payload });
    return response.data;
  },
  getTransactions: async ({ page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get('/transactions', { params: { page, limit } });
    return response.data;
  },
};
