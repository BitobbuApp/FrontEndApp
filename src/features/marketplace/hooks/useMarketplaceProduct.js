import { useQuery } from '@tanstack/react-query';
import { marketplaceApi } from '../services/marketplaceApi';

export function useMarketplaceProduct(id) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['marketplace-product', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await marketplaceApi.getMarketplaceOfferById(id);
            return response.data;
        },
        enabled: !!id,
    });

    return {
        product: data,
        isLoading,
        error,
    };
}
