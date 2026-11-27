/**
 * On-demand build & Vercel deploy script for injecting analytics/marketing IDs (e.g. Meta Pixel)
 * without hardcoding them in index.html or committing them to .env files.
 *
 * Usage (local / CI build):
 *   npm run build:analytics -- --meta-pixel=1611912130204587
 *   npm run build:analytics -- --meta-pixel=1611912130204587 --gtm=GTM-W4ZG726H --ga=G-E8B160F46S
 *
 * Usage (Vercel deploy on demand):
 *   npm run deploy:vercel:analytics -- --env=production --meta-pixel=1611912130204587
 */
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);

function getFlag(name) {
  const prefix = `--${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length).trim() : '';
}

const mode = args.includes('--vercel') ? 'vercel' : 'build';
const targetEnv = getFlag('env') || 'production';
const metaPixelId = getFlag('meta-pixel') || process.env.VITE_META_PIXEL_ID || '';
const gtmId = getFlag('gtm') || process.env.VITE_GTM_ID || '';
const gaId = getFlag('ga') || process.env.VITE_GA_MEASUREMENT_ID || '';
const clarityId = getFlag('clarity') || process.env.VITE_CLARITY_ID || '';
const contentsquareSrc = getFlag('contentsquare') || process.env.VITE_CONTENTSQUARE_SRC || '';

if (metaPixelId && !/^\d+$/.test(metaPixelId)) {
  console.error(`[deploy-analytics] Invalid --meta-pixel value "${metaPixelId}". Expected digits only.`);
  process.exit(1);
}

const injectedEnv = {
  ...(metaPixelId && { VITE_META_PIXEL_ID: metaPixelId }),
  ...(gtmId && { VITE_GTM_ID: gtmId }),
  ...(gaId && { VITE_GA_MEASUREMENT_ID: gaId }),
  ...(clarityId && { VITE_CLARITY_ID: clarityId }),
  ...(contentsquareSrc && { VITE_CONTENTSQUARE_SRC: contentsquareSrc }),
};

const activeKeys = Object.keys(injectedEnv);
console.log(
  activeKeys.length
    ? `[deploy-analytics] Injecting on-demand env vars: ${activeKeys.join(', ')}`
    : '[deploy-analytics] No analytics IDs provided — building clean without trackers.'
);

if (mode === 'vercel') {
  const vercelArgs = ['vercel', 'deploy'];
  if (targetEnv === 'production') vercelArgs.push('--prod');
  for (const [k, v] of Object.entries(injectedEnv)) {
    vercelArgs.push('--build-env', `${k}=${v}`);
  }
  const res = spawnSync('npx', vercelArgs, { stdio: 'inherit', shell: true });
  process.exit(res.status ?? 1);
}

const res = spawnSync('npx', ['vite', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, ...injectedEnv },
});
process.exit(res.status ?? 1);

