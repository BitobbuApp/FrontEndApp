import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { companyApi } from '../services/companyApi';

export function useMyCompany() {
    const { user, isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ['myCompany', user?.id],
        queryFn: async () => {
            try {
                // Fetch using JWT only. /companies/me infers the ID from the token on the backend.
                const response = await companyApi.getMyCompany();
                return response.data || null;
            } catch (error) {
                // If company doesn't exist, ignore (onboarding may be needed)
                if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        },
        enabled: isAuthenticated && !!user,
        staleTime: Infinity, // Guardar en memoria
        gcTime: Infinity,
    });
}
