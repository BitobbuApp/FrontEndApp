// src/layouts/MainLayout/useLayoutData.js
// Centralises every react-query call that the app shell needs.
// Fully migrated from base44 to real backend APIs.

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { requestsApi } from '@/features/requests/services/requestsApi';
import { quoteResponsesApi } from '@/features/requests/services/quoteResponsesApi';
import { useMyCompany } from '@/features/settings/hooks/useMyCompany';
import { getNotifications } from '@/features/notifications/services/notificationsApi';

export default function useLayoutData() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch company data globally from cache
    const { data: companyResponse } = useMyCompany();
    const myCompany = companyResponse || null;

    // Count of active requests (for sidebar badge)
    const { data: requestsData } = useQuery({
        queryKey: ['layoutRequestsCount'],
        queryFn: () => requestsApi.getCompanyRequests({ page: 1, limit: 1 }),
        enabled: !!user,
        staleTime: 30000,
    });

    // Count of received offers (for sidebar badge)
    const { data: receivedData } = useQuery({
        queryKey: ['layoutReceivedCount'],
        queryFn: () => quoteResponsesApi.getReceivedQuoteResponses({ page: 1, limit: 1 }),
        enabled: !!user,
        staleTime: 30000,
    });

    // 🔔 Real notifications from the backend
    const { data: notificationsData } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotifications({ page: 1, limit: 20 }),
        enabled: !!user,
        staleTime: 60000,          // Refresca cada minuto como fallback al socket
        refetchOnWindowFocus: true,
    });

    const solicitudesCount = requestsData?.data?.total || requestsData?.total || 0;
    const ofertasCount = receivedData?.data?.total || receivedData?.total || 0;

    const notifications = notificationsData?.data || [];
    const unreadCount = notificationsData?.unreadCount ?? 0;

    // Exposed so GlobalSocketManager can invalidate from outside this hook
    const invalidateNotifications = () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    return {
        user,
        myCompany,
        notifications,
        unreadCount,
        solicitudesCount,
        ofertasCount,
        mensajesCount: 0,
        invalidateNotifications,
    };
}
