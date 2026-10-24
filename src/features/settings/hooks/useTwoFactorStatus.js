import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { getTwoFactorStatus } from '@/features/auth/services/authApi';

export const TWO_FACTOR_STATUS_KEY = 'two-factor-status';

/** Own 2FA state plus the company policy: { enabled, enabled_at, recovery_codes_remaining, company_requires_2fa, password_changed_at } */
export function useTwoFactorStatus() {
    const { user, isAuthenticated } = useAuth();

    return useQuery({
        queryKey: [TWO_FACTOR_STATUS_KEY, user?.id],
        queryFn: getTwoFactorStatus,
        enabled: isAuthenticated && !!user,
    });
}
