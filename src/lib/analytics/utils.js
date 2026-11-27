export function generateEventId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getCookie(name) {
  if (typeof document === 'undefined' || !document.cookie) return undefined;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : undefined;
}

export function getAnalyticsHeaders(eventId) {
  const headers = {};
  if (eventId) headers['X-Analytics-Event-Id'] = eventId;
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc');
  if (fbp) headers['X-Analytics-Fbp'] = fbp;
  if (fbc) headers['X-Analytics-Fbc'] = fbc;
  if (typeof window !== 'undefined' && window.location?.href) {
    headers['X-Analytics-Source-Url'] = window.location.href;
  }
  return headers;
}

