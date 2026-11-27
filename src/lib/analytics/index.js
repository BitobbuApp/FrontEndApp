import { AnalyticsManager } from './AnalyticsManager';
import { createMetaPixelProvider } from './providers/metaPixelProvider';
import { createGtmProvider } from './providers/gtmProvider';
import { createGa4Provider } from './providers/ga4Provider';
import { createClarityProvider } from './providers/clarityProvider';
import { createContentsquareProvider } from './providers/contentsquareProvider';
import { generateEventId, getAnalyticsHeaders } from './utils';

export const analytics = new AnalyticsManager([
  createMetaPixelProvider(import.meta.env.VITE_META_PIXEL_ID),
  createGtmProvider(import.meta.env.VITE_GTM_ID),
  createGa4Provider(import.meta.env.VITE_GA_MEASUREMENT_ID),
  createClarityProvider(import.meta.env.VITE_CLARITY_ID),
  createContentsquareProvider(import.meta.env.VITE_CONTENTSQUARE_SRC),
]);

export { generateEventId, getAnalyticsHeaders };

