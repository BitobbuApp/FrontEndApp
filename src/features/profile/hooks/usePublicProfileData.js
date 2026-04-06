import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { companyApi } from '@/features/settings/services/companyApi';
import { useAuth } from '@/features/auth/AuthContext';
import { useMyCompany } from '@/features/settings/hooks/useMyCompany';

/**
 * Fetches a company's public profile by ID (from route param).
 * Used exclusively in PublicProfilePage (read-only view for other companies).
 */
export default function usePublicProfileData() {
    const { id } = useParams();

    const { user } = useAuth();
    const { data: myCompany, isLoading: isLoadingMyCompany } = useMyCompany();
    const isMyProfile = Boolean(
        myCompany?.id && (myCompany.id === id || !id)
    ) || Boolean(user?.has_company && !id);

    const { data: publicCompany, isLoading: isLoadingPublic } = useQuery({
        queryKey: ['companyPublic', id],
        queryFn: async () => {
            if (isMyProfile) return null; // Avoid fetch if it's my own profile
            const res = await companyApi.getCompanyById(id);
            return res.data;
        },
        enabled: !!id && !isMyProfile, // Only fetch if ID is present and it is NOT me
    });

    const company = isMyProfile ? myCompany : publicCompany;
    const isLoading = isMyProfile ? isLoadingMyCompany : isLoadingPublic;

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
