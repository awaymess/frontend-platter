import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(`${BASE_URL}/th/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    assert(page.url().includes('/th/login'), `Expected login route, got: ${page.url()}`);
    assert((await page.locator('#login-email').count()) > 0, 'Missing login email input');
    assert((await page.locator('#login-password').count()) > 0, 'Missing login password input');
    assert((await page.locator('#login-submit-btn').count()) > 0, 'Missing login submit button');

    await page.goto(`${BASE_URL}/th/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    assert(
      page.url().includes('/th/login'),
      `Expected unauthenticated dashboard redirect to login, got: ${page.url()}`
    );

    console.log('E2E smoke checks passed.');
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
