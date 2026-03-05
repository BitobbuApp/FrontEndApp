// src/features/offers/hooks/useOffersData.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function useOffersData() {
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
    });

    const { data: ofertas = [], isLoading } = useQuery({
        queryKey: ['ofertas', user?.email],
        queryFn: () =>
            base44.entities.Oferta.filter(
                { comprador_id: user?.email },
                '-created_date',
            ),
        enabled: !!user?.email,
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, motivo }) =>
            base44.entities.Oferta.update(id, {
                estado: 'Rechazada',
                motivo_rechazo: motivo,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ofertas'] });
            toast.success('Oferta rechazada');
        },
    });

    const acceptMutation = useMutation({
        mutationFn: (id) =>
            base44.entities.Oferta.update(id, { estado: 'Aceptada' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ofertas'] });
            toast.success('Oferta aceptada');
        },
    });

    return {
        user,
        ofertas,
        isLoading,
        rejectMutation,
        acceptMutation,
    };
}
