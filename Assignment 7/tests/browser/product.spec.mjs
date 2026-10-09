import { test, expect } from '@playwright/test';
// Model a separate client per suite so authentication throttles stay enabled.
test.use({ extraHTTPHeaders: { 'x-forwarded-for': '192.0.2.2' } });


const details = {
  id: 1, slug: 'sorno-machi-chal', nameBn: 'স্বর্ণমাছি চাল', category: 'chal', categoryNameBn: 'চাল', unit: 'kg', image: '🍚', today: 148, yesterday: 145, change: { dir: 'up', pct: 2.1 },
  markets: [{ market: 'পরীক্ষা বাজার এক', division: 'ঢাকা', min: 140, max: 160 }, { market: 'পরীক্ষা বাজার দুই', division: 'সিলেট', min: 130, max: 170 }],
};

test('product page and detail API reject anonymous and forged sessions', async ({ page, request }) => {
  const anonymous = await request.get('/api/products/sorno-machi-chal');
  expect(anonymous.status()).toBe(401);
  const forged = await request.get('/api/products/sorno-machi-chal', { headers: { cookie: 'better-auth.session_token=forged' } });
  expect(forged.status()).toBe(401);
  await page.goto('/product/sorno-machi-chal');
  await expect(page).toHaveURL(/\/signin/);
  await expect(page.getByRole('heading', { name: 'সাইন ইন', exact: true })).toBeVisible();
  await expect(page.getByRole('table')).toHaveCount(0);
});

test('authenticated details render markets, retry failures, show missing products and survive reload', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/products', route => route.fulfill({ json: [] }));
  const email = `details-${Date.now()}@example.com`;
  const credentials = { email, password: 'Details-test-123!' };
  const origin = { origin: 'http://localhost:3100' };
  expect((await page.request.post('/api/auth/sign-up/email', { data: { ...credentials, name: 'Details Test' }, headers: origin })).ok()).toBe(true);
  expect((await page.request.post('/api/auth/sign-in/email', { data: credentials, headers: origin })).ok()).toBe(true);
  let failed = true;
  await page.route('**/api/products/sorno-machi-chal', route => failed ? route.fulfill({ status: 503, json: { error: 'Test outage' } }) : route.fulfill({ json: details }));
  await page.goto('/product/sorno-machi-chal');
  await expect(page.getByRole('heading', { name: 'বাজারের দাম পাওয়া যাচ্ছে না' })).toBeVisible();
  failed = false;
  await page.getByRole('button', { name: 'আবার চেষ্টা করুন', exact: true }).click();
  await expect(page.getByRole('heading', { name: details.nameBn, exact: true })).toBeVisible();
  await expect(page.getByRole('table')).toContainText('পরীক্ষা বাজার এক');
  await expect(page.getByRole('table')).toContainText('১৭০ টাকা');
  await page.reload();
  await expect(page.getByRole('table')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/product-mobile.png', fullPage: true });
  await page.route('**/api/products/unknown', route => route.fulfill({ status: 404, json: { error: 'Not found' } }));
  await page.goto('/product/unknown');
  await expect(page.getByRole('heading', { name: 'পণ্যটি খুঁজে পাওয়া যায়নি' })).toBeVisible();
  await page.getByRole('button', { name: 'সাইন আউট', exact: true }).click();
  await page.goto('/product/sorno-machi-chal');
  await expect(page).toHaveURL(/\/signin/);
});
