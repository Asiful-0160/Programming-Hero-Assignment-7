import { test, expect } from '@playwright/test';
// Model a separate client per suite so authentication throttles stay enabled.
test.use({ extraHTTPHeaders: { 'x-forwarded-for': '192.0.2.1' } });


test('signup, validation, signin, persisted session, and signout on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Product API behavior is covered separately; avoid third-party outages in auth tests.
  await page.route('**/api/products', route => route.fulfill({ json: [] }));
  const email = `browser-${Date.now()}@example.com`;
  await page.goto('/signup');
  await page.getByLabel('নাম', { exact: true }).fill('Browser Test');
  await page.getByLabel('ইমেইল', { exact: true }).filter({ visible: true }).fill(email);
  await page.getByLabel('পাসওয়ার্ড', { exact: true }).filter({ visible: true }).fill('Browser-pass-123!');
  await page.getByLabel('পাসওয়ার্ড নিশ্চিত করুন', { exact: true }).fill('does-not-match');
  await page.getByRole('button', { name: 'অ্যাকাউন্ট তৈরি করুন', exact: true }).click();
  await expect(page.locator('#signup-error')).toContainText('পাসওয়ার্ড দুটি মিলছে না');
  await page.getByLabel('পাসওয়ার্ড নিশ্চিত করুন', { exact: true }).fill('Browser-pass-123!');
  await page.getByRole('button', { name: 'অ্যাকাউন্ট তৈরি করুন', exact: true }).click();
  await expect(page).toHaveURL(/\/signin$/);
  await page.getByLabel('ইমেইল', { exact: true }).filter({ visible: true }).fill(email);
  await page.getByLabel('পাসওয়ার্ড', { exact: true }).filter({ visible: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'সাইন ইন', exact: true }).click();
  await expect(page.locator('#signin-error')).toContainText('ইমেইল অথবা পাসওয়ার্ড সঠিক নয়');
  await page.getByLabel('পাসওয়ার্ড', { exact: true }).filter({ visible: true }).fill('Browser-pass-123!');
  await page.getByRole('button', { name: 'সাইন ইন', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:3100/');
  await expect(page.getByRole('link', { name: 'Browser Test' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: 'Browser Test' })).toBeVisible();
  await page.getByRole('button', { name: 'সাইন আউট', exact: true }).click();
  await expect(page.getByRole('link', { name: 'সাইন ইন', exact: true })).toBeVisible();
  const session = await page.request.get('/api/auth/get-session');
  expect(await session.json()).toBeNull();
  await page.goto('/signin');
  await expect(page.getByLabel('ইমেইল', { exact: true }).filter({ visible: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/signin-mobile.png', fullPage: true });
});
