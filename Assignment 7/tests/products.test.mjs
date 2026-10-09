import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchProducts, formatNumber, formatPercent, getMovers, isProduct } from '../src/lib/products.ts';

const product = (id, pct) => ({ id, slug: `product-${id}`, nameBn: 'চাল', category: 'chal', categoryNameBn: 'চাল', unit: 'kg', image: '🍚', today: 148, change: { dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat', pct } });

test('movers use numeric percentages, cap at six, exclude flat, and preserve input order', () => {
  const data = [product(1, 0), ...[2, 12, 3, 8, 10, 1, 4].map((pct, i) => product(i + 2, pct)), product(20, -2), product(21, -15)];
  const before = data.map(p => p.id);
  assert.deepEqual(getMovers(data, 'up').map(p => p.change.pct), [12, 10, 8, 4, 3, 2]);
  assert.deepEqual(getMovers(data, 'down').map(p => p.change.pct), [-15, -2]);
  assert.deepEqual(data.map(p => p.id), before);
});

test('Bengali formatting uses absolute change and keeps a decimal for zero', () => {
  assert.equal(formatNumber(1850), '১,৮৫০');
  assert.equal(formatPercent(-2.9), '২.৯');
  assert.equal(formatPercent(0), '০.০');
});

test('invalid prices and units are rejected', () => {
  assert.equal(isProduct(product(1, 2)), true);
  assert.equal(isProduct({ ...product(1, 2), today: '148' }), false);
  assert.equal(isProduct({ ...product(1, 2), unit: 'unknown' }), false);
});

test('primary HTTP failure falls back to alternate API', async () => {
  const urls = [];
  const data = await fetchProducts(async url => {
    urls.push(url);
    return urls.length === 1 ? new Response('', { status: 503 }) : Response.json([product(1, 2)]);
  });
  assert.equal(data.length, 1);
  assert.match(urls[1], /api.abcz/);
});

test('malformed primary response falls back; empty arrays are valid', async () => {
  let calls = 0;
  const data = await fetchProducts(async () => Response.json(++calls === 1 ? { unexpected: true } : []));
  assert.deepEqual(data, []);
  assert.equal(calls, 2);
});

test('both network failures produce an actionable failure', async () => {
  await assert.rejects(fetchProducts(async () => { throw new Error('offline'); }), /unavailable/);
});

import { getCategoryProducts } from '../src/lib/products.ts';

test('category filtering sorts numeric prices and restores API order without mutation', () => {
  const products = [
    { ...product(1, 1), today: 100 },
    { ...product(2, 2), category: 'dal', today: 1 },
    { ...product(3, -1), today: 9 },
    { ...product(4, 0), today: 20 },
    { ...product(5, 1), today: 20 },
  ];
  assert.deepEqual(getCategoryProducts(products, 'chal', 'price-asc').map(p => p.id), [3, 4, 5, 1]);
  assert.deepEqual(getCategoryProducts(products, 'chal', 'price-desc').map(p => p.id), [1, 4, 5, 3]);
  assert.deepEqual(getCategoryProducts(products, 'chal').map(p => p.id), [1, 3, 4, 5]);
  assert.deepEqual(products.map(p => p.id), [1, 2, 3, 4, 5]);
  assert.deepEqual(getCategoryProducts(products, 'missing'), []);
  assert.deepEqual(getCategoryProducts([], 'chal'), []);
});

import { fetchProductDetails, summarizeMarkets } from '../src/lib/products.ts';

test('market summaries use lowest min, highest max and mean of market midpoints', () => {
  assert.deepEqual(summarizeMarkets([{ market: 'A', division: 'X', min: 10, max: 20 }, { market: 'B', division: 'Y', min: 20, max: 50 }]), { min: 10, max: 50, average: 25 });
  assert.equal(summarizeMarkets([]), null);
});

test('details fallback rejects malformed markets and distinguishes missing product', async () => {
  const detail = { ...product(1, 2), yesterday: 145, markets: [{ market: 'A', division: 'X', min: 140, max: 150 }] };
  let calls = 0;
  const found = await fetchProductDetails('product-1', async () => Response.json([++calls === 1 ? { ...detail, markets: [{ market: 'A', division: 'X', min: 200, max: 100 }] } : detail]));
  assert.deepEqual(found, detail);
  assert.equal(calls, 2);
  assert.equal(await fetchProductDetails('missing', async () => Response.json([detail])), null);
  await assert.rejects(fetchProductDetails('product-1', async () => new Response('', { status: 429 })), /unavailable/);
});
