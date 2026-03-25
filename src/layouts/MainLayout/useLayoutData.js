// src/layouts/MainLayout/useLayoutData.js
// Centralises every react-query call that the app shell needs.
// Fully migrated from base44 to real backend APIs.

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { requestsApi } from '@/features/requests/services/requestsApi';
import { quoteResponsesApi } from '@/features/requests/services/quoteResponsesApi';
import { companyApi } from '@/features/settings/services/companyApi';

export default function useLayoutData() {
    const { user } = useAuth();

    // Fetch company data if company_id is present
    const { data: companyResponse } = useQuery({
        queryKey: ['myCompany', user?.company_id],
        queryFn: () => companyApi.getCompanyById(user.company_id),
        enabled: !!user?.company_id,
        staleTime: 300000, // 5 minutes
    });

    const myCompany = companyResponse?.data || null;

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

    const solicitudesCount = requestsData?.data?.total || requestsData?.total || 0;
    const ofertasCount = receivedData?.data?.total || receivedData?.total || 0;

    // Notifications and messages — placeholders until modules are built
    const notifications = [];
    const mensajesCount = 0;

    return {
        user,
        myCompany,
        notifications,
        unreadCount: notifications.length,
        solicitudesCount,
        ofertasCount,
        mensajesCount,
    };
}
