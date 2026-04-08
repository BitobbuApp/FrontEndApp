// src/features/dashboard/hooks/useDashboardData.js
// Centralises every react-query call the Dashboard page needs.

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { requestsApi } from '@/features/requests/services/requestsApi';
import { quoteResponsesApi } from '@/features/requests/services/quoteResponsesApi';
import { getDashboardStats } from '../services/dashboardApi';
import { useMyCompany } from '@/features/settings/hooks/useMyCompany';

export default function useDashboardData() {
    const { user } = useAuth();
    const { data: company, isLoading: loadingCompany } = useMyCompany();

    // My company's requests (cotizaciones)
    const { data: requestsData, isLoading: loadingSolicitudes } = useQuery({
        queryKey: ['dashboardRequests'],
        queryFn: () => requestsApi.getCompanyRequests({ page: 1, limit: 5 }),
        enabled: !!user,
    });

    // Quote responses received for MY requests (offers others sent to me)
    const { data: receivedData, isLoading: loadingOfertas } = useQuery({
        queryKey: ['dashboardReceivedOffers'],
        queryFn: () => quoteResponsesApi.getReceivedQuoteResponses({ page: 1, limit: 5 }),
        enabled: !!user,
    });

    // Centralized Dashboard Stats from Backend
    const { data: statsData, isLoading: loadingStats } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: getDashboardStats,
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });

    // API response shape after axiosClient interceptor:
    // { success, message, data: { items: [...], total, page, totalPages } }
    const solicitudes = Array.isArray(requestsData?.data)
        ? requestsData.data
        : requestsData?.data?.data || requestsData?.data?.items || [];

    const ofertas = Array.isArray(receivedData?.data)
        ? receivedData.data
        : receivedData?.data?.items || receivedData?.data?.data || [];


    const stats = statsData?.data || {
        buyer_stats: { generated_requests: 0, received_quotes: 0, generated_purchases: 0, estimated_savings: 0 },
        supplier_stats: { received_requests: 0, created_quotes: 0, generated_sales: 0, generated_revenue: 0 }
    };

    return {
        user,
        company,
        solicitudes,
        loadingSolicitudes: loadingSolicitudes || loadingStats || loadingCompany,
        ofertas,
        loadingOfertas,
        stats,
    };
}

