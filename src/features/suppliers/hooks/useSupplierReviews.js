import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '../services/suppliersApi';

/**
 * useSupplierReviews Hook
 * Fetches the latest reviews for a specific supplier/company.
 */
export const useSupplierReviews = (companyId, limit = 10) => {
    const { data: reviewsResponse, isLoading, isError, error } = useQuery({
        queryKey: ['company-reviews', companyId, limit],
        queryFn: () => suppliersApi.getCompanyReviews(companyId, limit),
        enabled: !!companyId,
    });

    return {
        reviews: reviewsResponse?.data || [],
        loading: isLoading,
        isError,
        error,
    };
};
