import type { NextConfig } from 'next';
import fs from 'fs';
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

function getEnvExampleFallback() {
  const parsedEnv: Record<string, string> = {};
  if (process.env.NODE_ENV === 'production') return parsedEnv;

  const envPath = path.join(process.cwd(), '.env.example');
  if (!fs.existsSync(envPath)) return parsedEnv;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    if (!key || process.env[key] !== undefined) continue;

    const finalValue = rawValue.replace(/^(['"])(.*)\1$/, '$2');

    // Update process.env for Server, and parsedEnv for Client mapping
    process.env[key] = finalValue;
    parsedEnv[key] = finalValue;
  }
  return parsedEnv;
}

const fallbackEnvs = getEnvExampleFallback();

const nextConfig: NextConfig = {
  output: 'standalone',
  env: fallbackEnvs,
};

export default withNextIntl(nextConfig);
