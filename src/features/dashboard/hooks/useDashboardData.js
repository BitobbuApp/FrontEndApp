// src/features/dashboard/hooks/useDashboardData.js
// Centralises every react-query call the Dashboard page needs.

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useDashboardData() {
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
    });

    const { data: solicitudes = [], isLoading: loadingSolicitudes } = useQuery({
        queryKey: ['solicitudes', user?.email],
        queryFn: () =>
            base44.entities.Solicitud.filter(
                { created_by: user?.email },
                '-created_date',
                5,
            ),
        enabled: !!user?.email,
    });

    const { data: ofertas = [], isLoading: loadingOfertas } = useQuery({
        queryKey: ['ofertas', user?.email],
        queryFn: () =>
            base44.entities.Oferta.filter(
                { comprador_id: user?.email, estado: 'Pendiente' },
                '-created_date',
                5,
            ),
        enabled: !!user?.email,
    });

    const { data: allSolicitudes = [] } = useQuery({
        queryKey: ['allSolicitudes', user?.email],
        queryFn: () =>
            base44.entities.Solicitud.filter({ created_by: user?.email }),
        enabled: !!user?.email,
    });

    const { data: allOfertas = [] } = useQuery({
        queryKey: ['allOfertas', user?.email],
        queryFn: () =>
            base44.entities.Oferta.filter({ comprador_id: user?.email }),
        enabled: !!user?.email,
    });

    const { data: transacciones = [] } = useQuery({
        queryKey: ['transacciones', user?.email],
        queryFn: () =>
            base44.entities.Transaccion.filter({
                comprador_id: user?.email,
                estado: 'Completada',
            }),
        enabled: !!user?.email,
    });

    const stats = useMemo(() => {
        return {
            cotizacionesActivas: allSolicitudes.filter((s) => s.estado === 'Activo')
                .length,
            ofertasRecibidas: allOfertas.filter((o) => o.estado === 'Pendiente')
                .length,
            ventasGeneradas: transacciones.length,
            proveedoresConectados: new Set(allOfertas.map((o) => o.proveedor_id))
                .size,
            ahorroEstimado: transacciones.reduce(
                (acc, t) => acc + t.monto_total * 0.15,
                0,
            ),
        };
    }, [allSolicitudes, allOfertas, transacciones]);

    return {
        user,
        solicitudes,
        loadingSolicitudes,
        ofertas,
        loadingOfertas,
        stats,
    };
}
