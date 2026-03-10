import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { requestsApi } from '@/features/requests/services/requestsApi';
import { useState } from 'react';

export function useProspectsData(searchTerm, categoryFilter) {
    const { user } = useAuth();

    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: paginatedData, isLoading } = useQuery({
        queryKey: ['marketplace-requests', page, limit],
        queryFn: async () => {
            const response = await requestsApi.getMarketplaceRequests({ page, limit });
            return response.data; // { data: [...], total, page, limit }
        },
        enabled: !!user,
    });

    const requests = paginatedData?.data || [];
    const total = paginatedData?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // Client-side filters (search + category)
    const filteredSolicitudes = requests.filter((req) => {
        const matchesSearch =
            !searchTerm ||
            req.product_service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === 'Todas' || req.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return {
        user,
        filteredSolicitudes,
        isLoading,
        page,
        setPage,
        total,
        totalPages,
    };
}
