import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useSuppliersData(searchTerm, sectorFilter, planFilter, ratingFilter) {
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
    });

    const { data: proveedores = [], isLoading } = useQuery({
        queryKey: ['proveedores'],
        queryFn: async () => {
            const companies = await base44.entities.Company.filter(
                {
                    interes: 'Vender',
                },
                '-calificacion_promedio'
            );
            const both = await base44.entities.Company.filter(
                {
                    interes: 'Ambos',
                },
                '-calificacion_promedio'
            );
            return [...companies, ...both].filter((c) => c.created_by !== user?.email);
        },
        enabled: !!user?.email,
    });

    const filteredProveedores = proveedores.filter((prov) => {
        const matchesSearch =
            prov.nombre_comercial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prov.sector?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = sectorFilter === 'Todos' || prov.sector === sectorFilter;
        const matchesPlan = planFilter === 'Todos' || prov.plan_suscripcion === planFilter;

        let matchesRating = true;
        if (ratingFilter === '4+ Estrellas')
            matchesRating = (prov.calificacion_promedio || 0) >= 4;
        if (ratingFilter === '3+ Estrellas')
            matchesRating = (prov.calificacion_promedio || 0) >= 3;

        return matchesSearch && matchesSector && matchesPlan && matchesRating;
    });

    return {
        user,
        proveedores,
        filteredProveedores,
        isLoading,
    };
}
