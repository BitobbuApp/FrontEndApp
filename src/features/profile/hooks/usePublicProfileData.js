import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { companyApi } from '@/features/settings/services/companyApi';
import { useAuth } from '@/features/auth/AuthContext';
import { useMyCompany } from '@/features/settings/hooks/useMyCompany';

function getLocationLabel(company) {
    const mainLocation = company?.locations?.[0];
    return [
        mainLocation?.city?.name,
        mainLocation?.state?.name,
        mainLocation?.location_city,
        mainLocation?.location_state,
    ].filter(Boolean).join(', ') || company?.ubicacion_ciudad || '';
}

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
    const location = getLocationLabel(company);
    const rating = company?.average_rating ?? 0;
    const totalReviews = company?.review_count ?? company?.total_reviews ?? 0;
    const transactions = company?.transaction_count ?? company?.total_transactions ?? 0;
    const products = company?.products_count ?? 0;

    let trustScore = 0;
    if (company) {
        if (company.verification_info?.status === 'verified' || company.is_verified) trustScore += 40;
        if (company.logo_url) trustScore += 10;
        if (company.trade_name || company.nombre_comercial) trustScore += 5;
        if (company.sector) trustScore += 5;
        if (company.company_type || company.tipo_empresa) trustScore += 5;
        if (company.locations?.length > 0) trustScore += 5;
        if (company.bio) trustScore += 5;
        if (company.founding_year) trustScore += 5;
        if (company.contacts?.length > 0 && (company.contacts[0].whatsapp || company.contacts[0].corporate_email)) trustScore += 10;
        if (company.payment_methods?.length > 0) trustScore += 5;
        if (company.website || company.linkedin || company.instagram) trustScore += 5;
    }

    return {
        id,
        company,
        isLoading,
        isMyProfile,
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
        trustScore,
    };
}
