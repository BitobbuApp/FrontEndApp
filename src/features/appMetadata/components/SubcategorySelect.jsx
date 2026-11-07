import React, { useMemo } from 'react';
import SearchableSelect from '@/components/shared/SearchableSelect';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';
import { buildSubcategoryGroups, findSubcategoryCategory } from '@/features/appMetadata/utils/subcategoryGroups';

/**
 * Optional subcategory picker tied to a category field.
 * - With a category: only its subcategories.
 * - Without one: searches all of them (grouped) and choosing one also sets its category.
 * onChange(subcategoryValue | '', categoryValue) — categoryValue is the parent of the chosen subcategory.
 */
export default function SubcategorySelect({
    categoryValue = '',
    value = '',
    onChange,
    priorityCategoryValues,
    placeholder,
    disabled = false,
    className = '',
}) {
    const { categoryOptions, subcategoryOptions, getSubcategoryOptions } = useAppMetadata();

    const groups = useMemo(
        () => buildSubcategoryGroups(categoryOptions, getSubcategoryOptions, { categoryValue, priorityCategoryValues }),
        [categoryOptions, getSubcategoryOptions, categoryValue, priorityCategoryValues]
    );

    const hasOptions = groups.some((group) => group.options.length > 0);

    return (
        <SearchableSelect
            groups={groups}
            value={value ? String(value) : ''}
            onChange={(next) => onChange(next, next ? findSubcategoryCategory(subcategoryOptions, next) : categoryValue)}
            placeholder={placeholder || (hasOptions
                ? (categoryValue ? 'Seleccionar subcategoría (opcional)' : 'Buscar subcategoría (opcional)')
                : 'Esta categoría no tiene subcategorías')}
            searchPlaceholder="Ej: lácteos, repuestos, nómina…"
            emptyText="No encontramos esa subcategoría"
            disabled={disabled || !hasOptions}
            className={className}
        />
    );
}
