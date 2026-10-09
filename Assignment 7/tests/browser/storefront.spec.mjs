import { test, expect } from '@playwright/test';

test.use({ extraHTTPHeaders: { 'x-forwarded-for': '192.0.2.4' } });
const products = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1, slug: `test-product-${i + 1}`, nameBn: `পরীক্ষার পণ্য ${i + 1}`, category: i < 8 ? 'chal' : 'dal', categoryNameBn: i < 8 ? 'চাল' : 'ডাল', unit: 'kg', image: '🍚', today: [100, 9, 20, 150, 40, 80, 60, 30][i % 8], change: { dir: i < 8 ? 'up' : 'down', pct: i < 8 ? i + 1 : -(i - 7) },
}));

for (const width of [320, 768, 1440]) {
  test(`home and category layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api/products', route => route.fulfill({ json: products }));
    await page.goto('/');
    await expect(page.locator('#সব-পণ্য ul > li')).toHaveCount(16);
    await expect(page.locator('section[aria-labelledby="movers-up"] li')).toHaveCount(6);
    await expect(page.locator('section[aria-labelledby="movers-down"] li')).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('link', { name: 'সব পণ্য দেখুন' }).click();
    expect(decodeURIComponent(new URL(page.url()).hash)).toBe('#সব-পণ্য');
    if (width === 1440) await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
    await page.goto('/category/chal');
    const list = page.locator('section[aria-label="বিভাগের পণ্য"] ul');
    await expect(list.locator('li')).toHaveCount(8);
    await page.getByLabel('সাজান:').selectOption('price-asc');
    await expect(list.locator('li').first()).toContainText('পরীক্ষার পণ্য 2');
    await page.getByLabel('সাজান:').selectOption('price-desc');
    await expect(list.locator('li').first()).toContainText('পরীক্ষার পণ্য 4');
    await page.getByLabel('সাজান:').selectOption('default');
    await expect(list.locator('li').first()).toContainText('পরীক্ষার পণ্য 1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.reload();
    await expect(list.locator('li')).toHaveCount(8);
  });
}

test('loading, outage retry, empty category, invalid route, and reduced motion', async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let fail = true;
  await page.route('**/api/products', async route => {
    await gate;
    await route.fulfill({ status: fail ? 503 : 200, json: fail ? { error: 'Test outage' } : products });
  });
  await page.goto('/');
  await expect(page.locator('#সব-পণ্য')).toHaveAttribute('aria-busy', 'true');
  release();
  await expect(page.getByRole('heading', { name: 'দামের তথ্য পাওয়া যায়নি' })).toBeVisible();
  fail = false;
  await page.getByRole('button', { name: 'আবার চেষ্টা করুন', exact: true }).click();
  await expect(page.locator('#সব-পণ্য ul > li')).toHaveCount(16);
  await page.getByRole('button', { name: 'থামান', exact: true }).click();
  await expect(page.locator('.ticker-track')).toHaveCSS('animation-play-state', 'paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.ticker-track')).toHaveCSS('animation-name', 'none');
  await page.goto('/category/mach');
  await expect(page.getByRole('heading', { name: 'এই বিভাগে কোনো পণ্য পাওয়া যায়নি' })).toBeVisible();
  await page.goto('/category/invalid');
  await expect(page.getByRole('heading', { name: 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' })).toBeVisible();
  await page.goto('/unknown-route');
  await expect(page.getByRole('heading', { name: 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' })).toBeVisible();
});
