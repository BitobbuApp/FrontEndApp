import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../services/dashboardApi';

/**
 * useDashboardStats Hook
 * Fetches dashboard statistics (solicitudes, cotizaciones, etc) and manages server state.
 */
export const useDashboardStats = () => {
    const { data: stats, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: getDashboardStats,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        stats: stats?.data || null,
        loading: isLoading,
        error,
        isError,
        refetch
    };
};
