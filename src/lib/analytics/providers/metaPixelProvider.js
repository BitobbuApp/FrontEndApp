const META_EVENT_MAP = {
  page_view: 'PageView',
  view_content: 'ViewContent',
  user_registered: 'CompleteRegistration',
  rfq_created: 'Lead',
  quote_submitted: 'SubmitApplication',
  subscription_payment_reported: 'InitiateCheckout',
  subscription_activated: 'Purchase',
};

export function createMetaPixelProvider(pixelId) {
  const id = (pixelId || '').trim();
  let initialized = false;

  return {
    name: 'meta-pixel',
    isEnabled() {
      return Boolean(id) && typeof window !== 'undefined';
    },
    init() {
      if (!this.isEnabled() || initialized) return;
      initialized = true;

      /* eslint-disable */
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */

      window.fbq('init', id);
    },
    pageView({ eventId } = {}) {
      if (!this.isEnabled() || typeof window.fbq !== 'function') return;
      window.fbq('track', 'PageView', {}, eventId ? { eventID: eventId } : undefined);
    },
    track(eventName, properties = {}, { eventId } = {}) {
      if (!this.isEnabled() || typeof window.fbq !== 'function') return;
      const mapped = META_EVENT_MAP[eventName] || eventName;
      const payload = {};
      if (properties.value !== undefined) payload.value = properties.value;
      if (properties.currency) payload.currency = properties.currency;
      if (properties.contentIds?.length) payload.content_ids = properties.contentIds;
      if (properties.contentType) payload.content_type = properties.contentType;
      if (properties.contentName) payload.content_name = properties.contentName;
      window.fbq('track', mapped, payload, eventId ? { eventID: eventId } : undefined);
    },
  };
}

