// src/layouts/MainLayout/useLayoutData.js
// Centralises every react-query call that the app shell needs.

import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useLayoutData() {
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
    });

    const { data: company } = useQuery({
        queryKey: ['myCompany', user?.email],
        queryFn: () => base44.entities.Company.filter({ created_by: user?.email }),
        enabled: !!user?.email,
    });

    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications', user?.email],
        queryFn: () =>
            base44.entities.Notificacion.filter({ usuario_id: user?.email, leida: false }),
        enabled: !!user?.email,
        refetchInterval: 10000,
    });

    const { data: solicitudesCount = 0 } = useQuery({
        queryKey: ['solicitudesCount', user?.email],
        queryFn: async () => {
            const sols = await base44.entities.Solicitud.filter({
                created_by: user?.email,
                estado: 'Activo',
            });
            return sols.length;
        },
        enabled: !!user?.email,
    });

    const { data: ofertasCount = 0 } = useQuery({
        queryKey: ['ofertasCount', user?.email],
        queryFn: async () => {
            const offs = await base44.entities.Oferta.filter({
                comprador_id: user?.email,
                estado: 'Pendiente',
            });
            return offs.length;
        },
        enabled: !!user?.email,
    });

    const { data: mensajesCount = 0 } = useQuery({
        queryKey: ['mensajesCount', user?.email],
        queryFn: async () => {
            const convs = await base44.entities.Conversacion.list();
            const myConvs = convs.filter(
                (c) =>
                    c.participante_1_id === user?.email ||
                    c.participante_2_id === user?.email,
            );
            return myConvs.reduce((acc, c) => {
                if (c.participante_1_id === user?.email)
                    return acc + (c.mensajes_no_leidos_1 || 0);
                return acc + (c.mensajes_no_leidos_2 || 0);
            }, 0);
        },
        enabled: !!user?.email,
    });

    return {
        user,
        myCompany: company?.[0] ?? null,
        notifications,
        unreadCount: notifications.length,
        solicitudesCount,
        ofertasCount,
        mensajesCount,
    };
}
