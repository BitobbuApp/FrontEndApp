import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/AuthContext';
import { requestsApi } from '../services/requestsApi';
import { toast } from 'sonner';
import { useState } from 'react';

export default function useRequestsData() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: paginatedData, isLoading } = useQuery({
        queryKey: ['requests', user?.company_id, page, limit],
        queryFn: async () => {
            const response = await requestsApi.getCompanyRequests({ page, limit });
            return response.data; // { data: [...], total, page, limit }
        },
        enabled: !!user?.company_id,
    });

    const requests = paginatedData?.data || [];
    const total = paginatedData?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const pauseMutation = useMutation({
        mutationFn: ({ id, status }) =>
            requestsApi.updateRequest(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            toast.success('Estado actualizado');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Error al actualizar estado';
            toast.error(message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => requestsApi.deleteRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            toast.success('Solicitud eliminada');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Error al eliminar solicitud';
            toast.error(message);
        },
    });

    const handleTogglePause = (request) => {
        const newStatus = request.status === 'Paused' ? 'Active' : 'Paused';
        pauseMutation.mutate({ id: request.id, status: newStatus });
    };

    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    return {
        user,
        requests,
        isLoading,
        page,
        setPage,
        total,
        totalPages,
        handleTogglePause,
        handleDelete,
    };
}
