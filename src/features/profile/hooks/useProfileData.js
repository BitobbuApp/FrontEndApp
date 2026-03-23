import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { companyApi } from '@/features/settings/services/companyApi';

/**
 * Fetches the authenticated company's own profile data.
 * Used exclusively in ProfilePage (private/owner view).
 */
export default function useProfileData() {
    const { user } = useAuth();

    const { data: company, isLoading } = useQuery({
        queryKey: ['myCompany', user?.company_id || user?.id],
        queryFn: async () => {
            if (user?.company_id) {
                const res = await companyApi.getCompanyById(user.company_id);
                return res.data;
            }
            if (user?.has_company) {
                const res = await companyApi.getMyCompany();
                return res.data;
            }
            return null;
        },
        enabled: !!user,
    });

    const initial = company?.trade_name?.[0] || company?.nombre_comercial?.[0] || user?.full_name?.[0] || 'C';
    const tradeName = company?.trade_name || company?.nombre_comercial || user?.full_name || 'Mi Empresa';
    const sector = company?.sector || '';
    const companyType = company?.company_type || company?.tipo_empresa || '';
    const location = [
        company?.locations?.[0]?.location_city,
        company?.locations?.[0]?.location_state,
    ].filter(Boolean).join(', ') || company?.ubicacion_ciudad || '';
    const rating = company?.average_rating ?? 0;
    const totalReviews = company?.total_reviews ?? 0;
    const transactions = company?.total_transactions ?? company?.transacciones ?? 0;
    const products = company?.products_count ?? 0;

    return {
        user,
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
