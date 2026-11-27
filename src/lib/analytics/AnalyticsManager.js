import { generateEventId, getAnalyticsHeaders } from './utils';

/**
 * Provider-agnostic frontend analytics orchestrator.
 * Any provider whose VITE_* env var is missing stays completely inactive (zero network requests).
 */
export class AnalyticsManager {
  constructor(providers = []) {
    this.providers = providers;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    for (const provider of this.providers) {
      if (provider.isEnabled()) {
        try {
          provider.init();
        } catch (err) {
          console.error(`[analytics] Failed to init ${provider.name}:`, err);
        }
      }
    }
  }

  pageView(path, pageName) {
    const eventId = generateEventId();
    for (const provider of this.providers) {
      if (provider.isEnabled() && typeof provider.pageView === 'function') {
        try {
          provider.pageView({ path, pageName, eventId });
        } catch (err) {
          console.error(`[analytics] pageView failed on ${provider.name}:`, err);
        }
      }
    }
    return eventId;
  }

  /**
   * Tracks a canonical event across all active providers and returns the deduplication context
   * (`eventId` + `headers`) so API calls can forward them to the backend CAPI dispatcher.
   */
  track(eventName, properties = {}) {
    const eventId = generateEventId();
    for (const provider of this.providers) {
      if (provider.isEnabled() && typeof provider.track === 'function') {
        try {
          provider.track(eventName, properties, { eventId });
        } catch (err) {
          console.error(`[analytics] track(${eventName}) failed on ${provider.name}:`, err);
        }
      }
    }
    return { eventId, headers: getAnalyticsHeaders(eventId) };
  }
}

