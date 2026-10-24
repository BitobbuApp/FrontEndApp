/**
 * Builds the groups used by SearchableSelect / GroupedMultiCombobox for subcategories.
 *
 * - With `categoryValue`: only the subcategories of that category (a single group).
 * - Without it: every category that has subcategories; `priorityCategoryValues` go first
 *   (e.g. the company's own categories), keeping the categoryOptions order inside each block.
 */
export function buildSubcategoryGroups(categoryOptions = [], getSubcategoryOptions, { categoryValue, priorityCategoryValues = [] } = {}) {
    const priority = new Set((priorityCategoryValues || []).map(String));

    const groups = categoryOptions
        .filter((category) => !categoryValue || category.value === String(categoryValue))
        .map((category) => ({
            value: category.value,
            label: category.label,
            options: getSubcategoryOptions(category.value),
            isPriority: priority.has(category.value),
        }))
        .filter((group) => group.options.length > 0);

    return [...groups.filter((group) => group.isPriority), ...groups.filter((group) => !group.isPriority)];
}

/** The parent category value of a subcategory option value (or '' if unknown). */
export function findSubcategoryCategory(subcategoryOptions = [], subcategoryValue) {
    return subcategoryOptions.find((option) => option.value === String(subcategoryValue))?.categoryValue || '';
}
