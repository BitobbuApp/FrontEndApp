// src/features/requests/hooks/useRequestsData.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function useRequestsData() {
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
    });

    const { data: myCompany } = useQuery({
        queryKey: ['myCompany', user?.email],
        queryFn: () => base44.entities.Company.filter({ created_by: user?.email }),
        enabled: !!user?.email,
    });

    const { data: solicitudes = [], isLoading } = useQuery({
        queryKey: ['solicitudes', user?.email],
        queryFn: () =>
            base44.entities.Solicitud.filter(
                { created_by: user?.email },
                '-created_date',
            ),
        enabled: !!user?.email,
    });

    const { data: ofertas = [] } = useQuery({
        queryKey: ['allOfertas'],
        queryFn: () => base44.entities.Oferta.list('-created_date'),
    });

    const pauseMutation = useMutation({
        mutationFn: ({ id, estado }) =>
            base44.entities.Solicitud.update(id, { estado }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
            toast.success('Estado actualizado');
        },
    });

    const getOfertasBySolicitud = (solicitudId) =>
        ofertas.filter((o) => o.solicitud_id === solicitudId);

    const handleTogglePause = (sol) => {
        const newEstado = sol.estado === 'Pausada' ? 'Activo' : 'Pausada';
        pauseMutation.mutate({ id: sol.id, estado: newEstado });
    };

    return {
        user,
        myCompany: myCompany?.[0] ?? null,
        solicitudes,
        isLoading,
        getOfertasBySolicitud,
        handleTogglePause,
    };
}
