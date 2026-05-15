import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { useMyCompany } from '@/features/settings/hooks/useMyCompany';

/**
 * Fetches the authenticated company's own profile data.
 * Used exclusively in ProfilePage (private/owner view).
 */
export default function useProfileData() {
    const { user } = useAuth();

    const { data: company, isLoading } = useMyCompany();

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
        trustScore,
    };
}
