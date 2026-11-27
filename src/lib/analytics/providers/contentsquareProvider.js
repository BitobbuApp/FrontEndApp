export function createContentsquareProvider(scriptSrc) {
  const src = (scriptSrc || '').trim();
  let initialized = false;

  return {
    name: 'contentsquare',
    isEnabled() {
      return Boolean(src) && typeof window !== 'undefined';
    },
    init() {
      if (!this.isEnabled() || initialized) return;
      initialized = true;

      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      document.body.appendChild(script);
    },
    pageView() {},
    track() {},
  };
}

