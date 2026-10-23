import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';
import { createPageUrl } from '@/utils';

/**
 * "Trabaja con": a company's subcategories grouped by category.
 * `subcategories` comes from the API as [{ id, name, category_id }] (active ones only).
 */
export default function CompanySubcategories({ subcategories = [], editable = false, title = 'Trabaja con', className = '' }) {
    const { categoryOptions } = useAppMetadata();

    const groups = useMemo(() => {
        const byCategory = new Map();
        subcategories.forEach((subcategory) => {
            const key = String(subcategory.category_id);
            if (!byCategory.has(key)) byCategory.set(key, []);
            byCategory.get(key).push(subcategory);
        });
        return [...byCategory.entries()].map(([categoryId, items]) => ({
            categoryId,
            label: categoryOptions.find((option) => option.value === categoryId)?.label || 'Otras',
            items,
        }));
    }, [subcategories, categoryOptions]);

    if (groups.length === 0 && !editable) return null;

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">{title}</p>
                {editable && (
                    <Link
                        to={`${createPageUrl('Configuracion')}?tab=comercial`}
                        className="text-xs font-medium text-slate-500 hover:text-slate-900 underline-offset-2 hover:underline"
                    >
                        {groups.length === 0 ? 'Agregar subcategorías' : 'Editar en Configuración'}
                    </Link>
                )}
            </div>
            {groups.length === 0 ? (
                <p className="text-xs text-slate-400">Aún no indicaste con qué subcategorías trabajas.</p>
            ) : (
                <div className="space-y-2">
                    {groups.map((group) => (
                        <div key={group.categoryId} className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-600 mr-1">{group.label}:</span>
                            {group.items.map((subcategory) => (
                                <Badge key={subcategory.id} variant="outline" className="text-xs">
                                    {subcategory.name}
                                </Badge>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
