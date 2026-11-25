export function createGtmProvider(gtmId) {
  const id = (gtmId || '').trim();
  let initialized = false;

  return {
    name: 'gtm',
    isEnabled() {
      return Boolean(id) && typeof window !== 'undefined';
    },
    init() {
      if (!this.isEnabled() || initialized) return;
      initialized = true;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const firstScript = document.getElementsByTagName('script')[0];
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
      firstScript.parentNode.insertBefore(script, firstScript);
    },
    pageView({ path, pageName, eventId } = {}) {
      if (!this.isEnabled()) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'page_view', page_path: path, page_name: pageName, event_id: eventId });
    },
    track(eventName, properties = {}, { eventId } = {}) {
      if (!this.isEnabled()) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, event_id: eventId, ...properties });
    },
  };
}

