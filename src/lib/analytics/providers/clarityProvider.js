export function createClarityProvider(clarityId) {
  const id = (clarityId || '').trim();
  let initialized = false;

  return {
    name: 'clarity',
    isEnabled() {
      return Boolean(id) && typeof window !== 'undefined';
    },
    init() {
      if (!this.isEnabled() || initialized) return;
      initialized = true;

      /* eslint-disable */
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r);
        t.async = 1;
        t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', id);
      /* eslint-enable */
    },
    pageView() {},
    track() {},
  };
}

