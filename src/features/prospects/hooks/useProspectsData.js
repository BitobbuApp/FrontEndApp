import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useProspectsData(searchTerm, categoryFilter) {
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
        queryKey: ['leads'],
        queryFn: async () => {
            const all = await base44.entities.Solicitud.filter({ estado: 'Activo' }, '-created_date');
            return all.filter((s) => s.created_by !== user?.email);
        },
        enabled: !!user?.email,
    });

    const filteredSolicitudes = solicitudes.filter((sol) => {
        const matchesSearch = sol.producto_servicio.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'Todas' || sol.categoria === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return {
        user,
        myCompany,
        solicitudes,
        filteredSolicitudes,
        isLoading,
    };
}
