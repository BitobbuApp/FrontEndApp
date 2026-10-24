import { useCallback } from 'react';
import useAppMetadata from './useAppMetadata';
import { findSubcategoryCategory } from '../utils/subcategoryGroups';

/**
 * Keeps a form's category and (optional) subcategory consistent:
 * - changing the category clears a subcategory that belongs to another category;
 * - choosing a subcategory sets its category.
 */
export function useCategorySubcategoryHandlers(setForm, { categoryKey = 'category_id', subcategoryKey = 'subcategory_id' } = {}) {
    const { subcategoryOptions } = useAppMetadata();

    const onCategoryChange = useCallback((categoryValue) => {
        setForm((prev) => {
            const current = prev[subcategoryKey];
            const keepSubcategory = current && findSubcategoryCategory(subcategoryOptions, current) === categoryValue;
            return { ...prev, [categoryKey]: categoryValue, [subcategoryKey]: keepSubcategory ? current : '' };
        });
    }, [setForm, subcategoryOptions, categoryKey, subcategoryKey]);

    const onSubcategoryChange = useCallback((subcategoryValue, categoryValue) => {
        setForm((prev) => ({
            ...prev,
            [subcategoryKey]: subcategoryValue,
            ...(subcategoryValue && categoryValue && { [categoryKey]: categoryValue }),
        }));
    }, [setForm, categoryKey, subcategoryKey]);

    return { onCategoryChange, onSubcategoryChange };
}
