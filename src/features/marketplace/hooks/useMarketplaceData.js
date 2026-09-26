import { useQuery } from '@tanstack/react-query';
import { marketplaceApi } from '../services/marketplaceApi';
import useDebounce from '@/hooks/useDebounce';

export function useMarketplaceData(filters) {
    const {
        searchTerm,
        categoryId,
        countryId,
        stateId,
        minPrice,
        maxPrice,
        sortBy,
        page,
        limit,
    } = filters;

    // Debounce the search term to avoid spamming the backend
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data, isLoading, error } = useQuery({
        queryKey: [
            'marketplace-products',
            debouncedSearchTerm,
            categoryId,
            countryId,
            stateId,
            minPrice,
            maxPrice,
            sortBy,
            page,
            limit,
        ],
        queryFn: async () => {
            const params = {
                searchTerm: debouncedSearchTerm || undefined,
                categoryId: categoryId || undefined,
                countryId: countryId || undefined,
                stateId: stateId || undefined,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                sortBy: sortBy || undefined,
                page,
                limit,
            };

            const response = await marketplaceApi.getMarketplaceOffers(params);
            return response; // { data: [...], total: X }
        },
        keepPreviousData: true,
    });

    return {
        productos: data?.data?.data || [],
        total: data?.data?.total || 0,
        priceRange: data?.data?.priceRange || { min: 0, max: 0 },
        isLoading,
        error,
    };
}
