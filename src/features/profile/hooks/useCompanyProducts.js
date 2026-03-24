import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/productsApi';

/**
 * Hook to fetch products/services for a specific company.
 * @param {string} companyId - The ID of the company.
 */
export default function useCompanyProducts(companyId) {
    return useQuery({
        queryKey: ['companyProducts', companyId],
        queryFn: async () => {
            if (!companyId) return [];
            const res = await productsApi.getProductsByCompany(companyId);
            return res.data;
        },
        enabled: !!companyId,
    });
}
