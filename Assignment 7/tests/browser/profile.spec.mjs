import { test, expect } from '@playwright/test';
// Model a separate client per suite so authentication throttles stay enabled.
test.use({ extraHTTPHeaders: { 'x-forwarded-for': '192.0.2.3' } });


test('profile routes and update endpoint reject anonymous users', async ({ page, request }) => {
  for (const path of ['/profile', '/profile/edit']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/signin/);
  }
  const update = await request.post('/api/auth/update-user', { headers: { origin: 'http://localhost:3100' }, data: { name: 'Not allowed' } });
  expect(update.status()).toBe(401);
});

test('profile name validation and persistence with navbar updates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/products', route => route.fulfill({ json: [] }));
  const email = `profile-${Date.now()}@example.com`;
  const credentials = { email, password: 'Profile-test-123!' };
  const headers = { origin: 'http://localhost:3100' };
  expect((await page.request.post('/api/auth/sign-up/email', { headers, data: { ...credentials, name: 'Original Name' } })).ok()).toBe(true);
  const login = await page.request.post('/api/auth/sign-in/email', { headers, data: credentials });
  expect(login.status(), await login.text()).toBe(200);
  await page.goto('/profile');
  await expect(page.getByTestId('profile-name')).toHaveText('Original Name');
  await expect(page.getByText(email, { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'তথ্য আপডেট করুন', exact: true }).click();
  await expect(page).toHaveURL(/\/profile\/edit$/);
  await expect(page.getByLabel('নাম', { exact: true })).toHaveValue('Original Name');
  await page.getByLabel('নাম', { exact: true }).fill('   ');
  await page.getByRole('button', { name: 'তথ্য আপডেট করুন', exact: true }).click();
  await expect(page.locator('#profile-edit-error')).toBeVisible();
  const invalid = await page.request.post('/api/auth/update-user', { headers, data: { name: '  ' } });
  expect(invalid.status()).toBe(400);
  const longName = await page.request.post('/api/auth/update-user', { headers, data: { name: 'x'.repeat(101) } });
  expect(longName.status()).toBe(400);
  await page.getByLabel('নাম', { exact: true }).fill('  রহিম উদ্দিন  ');
  await page.getByRole('button', { name: 'তথ্য আপডেট করুন', exact: true }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByTestId('profile-name')).toHaveText('রহিম উদ্দিন');
  await expect(page.getByRole('banner').getByRole('link', { name: 'রহিম উদ্দিন' })).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('profile-name')).toHaveText('রহিম উদ্দিন');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/profile-mobile.png', fullPage: true });
  await page.getByRole('link', { name: 'তথ্য আপডেট করুন', exact: true }).click();
  await expect(page.getByLabel('নাম', { exact: true })).toHaveValue('রহিম উদ্দিন');
  await page.getByRole('button', { name: 'সাইন আউট', exact: true }).click();
  await page.goto('/profile/edit');
  await expect(page).toHaveURL(/\/signin/);
});
