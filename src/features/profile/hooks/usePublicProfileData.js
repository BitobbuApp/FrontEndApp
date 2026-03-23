import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { companyApi } from '@/features/settings/services/companyApi';

/**
 * Fetches a company's public profile by ID (from route param).
 * Used exclusively in PublicProfilePage (read-only view for other companies).
 */
export default function usePublicProfileData() {
    const { id } = useParams();

    const { data: company, isLoading } = useQuery({
        queryKey: ['companyPublic', id],
        queryFn: async () => {
            const res = await companyApi.getCompanyById(id);
            return res.data;
        },
        enabled: !!id,
    });

    const initial = company?.trade_name?.[0] || company?.nombre_comercial?.[0] || '?';
    const tradeName = company?.trade_name || company?.nombre_comercial || 'Empresa';
    const sector = company?.sector || '';
    const companyType = company?.company_type || company?.tipo_empresa || '';
    const location = [
        company?.locations?.[0]?.location_city,
        company?.locations?.[0]?.location_state,
    ].filter(Boolean).join(', ') || company?.ubicacion_ciudad || '';
    const rating = company?.average_rating ?? 0;
    const totalReviews = company?.total_reviews ?? 0;
    const transactions = company?.total_transactions ?? 0;
    const products = company?.products_count ?? 0;

    return {
        id,
        company,
        isLoading,
        // Derived display values
        initial,
        tradeName,
        sector,
        companyType,
        location,
        rating,
        totalReviews,
        transactions,
        products,
    };
}
