import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { companyApi } from '@/features/settings/services/companyApi';
import { useState } from 'react';

export function useSuppliersData(searchTerm, sectorFilter, ratingFilter) {
    const { user } = useAuth();

    const [page, setPage] = useState(1);
    const limit = 10;

    // Build server-side filter params
    const sectorParam = sectorFilter && sectorFilter !== 'Todos' ? sectorFilter : undefined;

    const { data: paginatedData, isLoading } = useQuery({
        queryKey: ['suppliers', page, limit, sectorParam],
        queryFn: async () => {
            const response = await companyApi.listCompanies({
                page,
                limit,
                sector: sectorParam,
            });
            return response.data; // { data: [...], total, page, limit }
        },
        enabled: !!user,
    });

    const companies = paginatedData?.data || [];
    const total = paginatedData?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // Client-side filters (search + rating + exclude own company)
    const filteredProveedores = companies.filter((company) => {
        // Exclude own company
        if (user?.company_id && company.id === user.company_id) return false;

        // Search filter
        const matchesSearch =
            !searchTerm ||
            company.trade_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.sector?.toLowerCase().includes(searchTerm.toLowerCase());

        // Rating filter
        let matchesRating = true;
        if (ratingFilter === '4+ Estrellas')
            matchesRating = (company.average_rating || 0) >= 4;
        if (ratingFilter === '3+ Estrellas')
            matchesRating = (company.average_rating || 0) >= 3;

        return matchesSearch && matchesRating;
    });

    return {
        user,
        filteredProveedores,
        isLoading,
        page,
        setPage,
        total,
        totalPages,
    };
}
