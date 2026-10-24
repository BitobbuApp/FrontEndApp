/** "Lácteos" → "lacteos": search ignores accents and case. */
export const normalize = (text) => String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** cmdk filter: every word typed must appear in the option or group label (keywords). */
export const accentInsensitiveFilter = (_value, search, keywords = []) => {
    const haystack = normalize(keywords.join(' '));
    return normalize(search).split(/\s+/).filter(Boolean).every((term) => haystack.includes(term)) ? 1 : 0;
};
