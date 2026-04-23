import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '../services/suppliersApi';

/**
 * useSupplierReviews Hook
 * Fetches the latest reviews for a specific supplier/company.
 */
export const useSupplierReviews = (companyId, page = 1, limit = 10) => {
    const { data: reviewsResponse, isLoading, isError, error } = useQuery({
        queryKey: ['company-reviews', companyId, page, limit],
        queryFn: () => suppliersApi.getCompanyReviews(companyId, page, limit),
        enabled: !!companyId,
    });
    
    // Response data structure from backend: { success, message, data: { items: [], total: number } }
    const result = reviewsResponse?.data || { items: [], total: 0 };

    return {
        reviews: result.items || [],
        total: result.total || 0,
        totalPages: Math.ceil((result.total || 0) / limit),
        loading: isLoading,
        isError,
        error,
    };
};
