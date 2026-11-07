import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { requestsApi } from '@/features/requests/services/requestsApi';
import { useMyCompany } from '@/features/settings/hooks/useMyCompany';
import { useEffect, useMemo, useState } from 'react';

export const EMPTY_PROSPECT_FILTERS = { categoryId: '', subcategoryId: '', onlyMine: false };

/**
 * Opportunities (RFQs of other companies) for the supplier.
 * Category / subcategory filters run in the backend (correct pagination);
 * the text search filters the current page on the client.
 * `onlyMine` restricts the list to the subcategories of the supplier's profile.
 */
export function useProspectsData(searchTerm, filters = EMPTY_PROSPECT_FILTERS) {
    const { user } = useAuth();
    const { data: myCompany } = useMyCompany();

    const [page, setPage] = useState(1);
    const limit = 10;

    const mySubcategoryIds = useMemo(
        () => (myCompany?.subcategories_of_interest || []).map((s) => Number(s.id)),
        [myCompany]
    );
    const myCategoryValues = useMemo(
        () => (myCompany?.categories_of_interest || []).map((c) => String(c.id)),
        [myCompany]
    );

    const categoryId = filters.categoryId ? Number(filters.categoryId) : undefined;
    const subcategoryIds = filters.onlyMine
        ? mySubcategoryIds
        : (filters.subcategoryId ? [Number(filters.subcategoryId)] : undefined);

    // Back to the first page whenever a filter changes
    useEffect(() => {
        setPage(1);
    }, [filters.categoryId, filters.subcategoryId, filters.onlyMine]);

    const { data: paginatedData, isLoading } = useQuery({
        queryKey: ['marketplace-requests', page, limit, categoryId ?? null, subcategoryIds?.join(',') ?? null],
        queryFn: async () => {
            const response = await requestsApi.getMarketplaceRequests({
                page,
                limit,
                category_id: categoryId,
                subcategory_ids: subcategoryIds,
            });
            return response.data; // { data: [...], total, page, limit }
        },
        enabled: !!user,
        placeholderData: keepPreviousData,
    });

    const requests = paginatedData?.data || [];
    const total = paginatedData?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // Client-side text search (current page)
    const filteredSolicitudes = requests.filter((req) =>
        !searchTerm ||
        req.product_service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
        // Direct RFQs (addressed only to this supplier) first
        .sort((a, b) => Number(!!b.is_direct) - Number(!!a.is_direct));

    return {
        user,
        filteredSolicitudes,
        isLoading,
        page,
        setPage,
        total,
        totalPages,
        myCategoryValues,
        hasMySubcategories: mySubcategoryIds.length > 0,
    };
}
