const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || '';

/**
 * Builds a full public URL for a storage file path.
 * If the path already starts with http, it returns it as-is.
 * Otherwise, prepends the R2 public base URL.
 *
 * @param {string | null | undefined} path - The file key or full URL
 * @returns {string} The complete public URL, or empty string if no path
 */
export function getStorageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${STORAGE_URL}/${path}`;
}
