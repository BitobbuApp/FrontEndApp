/**
 * Copies text to the clipboard. Resolves to true on success; false when the browser refuses
 * (insecure context, embedded views), so the caller can fall back to showing the text selected.
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}
