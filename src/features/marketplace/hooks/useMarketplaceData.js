import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useMarketplaceData(searchTerm, categoryFilter, typeFilter) {
    const { data: productos = [], isLoading } = useQuery({
        queryKey: ['productos'],
        queryFn: () => base44.entities.ProductoCatalogo.filter({ activo: true }, '-created_date'),
    });

    const filteredProducts = productos.filter((prod) => {
        const matchesSearch =
            prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prod.proveedor_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'Todas' || prod.categoria === categoryFilter;
        const matchesType = typeFilter === 'Todos' || prod.tipo_proveedor === typeFilter;
        return matchesSearch && matchesCategory && matchesType;
    });

    return {
        productos,
        filteredProducts,
        isLoading,
    };
}
