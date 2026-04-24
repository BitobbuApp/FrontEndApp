import { useQuery } from '@tanstack/react-query';
import { requestsApi } from '@/features/requests/services/requestsApi';

export function useProspectDetail(id, initialProspect = null) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['requestDetail', id],
        queryFn: async () => {
            const response = await requestsApi.getRequestById(id);
            return response.data;
        },
        enabled: !!id,
    });

    const prospect = data
        ? {
            ...initialProspect,
            ...data,
            company: data.company || initialProspect?.company || null,
        }
        : initialProspect;

    return {
        prospect,
        isLoading,
        isError,
    };
}
