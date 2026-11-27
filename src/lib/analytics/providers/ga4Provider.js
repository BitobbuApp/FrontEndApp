export function createGa4Provider(measurementId) {
  const id = (measurementId || '').trim();
  let initialized = false;

  return {
    name: 'ga4',
    isEnabled() {
      return Boolean(id) && typeof window !== 'undefined';
    },
    init() {
      if (!this.isEnabled() || initialized) return;
      initialized = true;

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', id, { send_page_view: false });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);
    },
    pageView({ path, pageName } = {}) {
      if (!this.isEnabled() || typeof window.gtag !== 'function') return;
      window.gtag('event', 'page_view', { page_path: path, page_title: pageName });
    },
    track(eventName, properties = {}) {
      if (!this.isEnabled() || typeof window.gtag !== 'function') return;
      window.gtag('event', eventName, properties);
    },
  };
}

