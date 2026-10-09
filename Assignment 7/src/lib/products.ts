export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  unit: string;
  image: string;
  today: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
};

export const units: Record<string, string> = { kg: "কেজি", litre: "লিটার", dozen: "ডজন", piece: "পিস" };
const numberFormatter = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 });
const percentFormatter = new Intl.NumberFormat("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const formatNumber = (value: number) => numberFormatter.format(value);
export const formatPercent = (value: number) => percentFormatter.format(Math.abs(value));

export function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const p = value as Product;
  return Number.isFinite(p.id) && [p.slug, p.nameBn, p.category, p.categoryNameBn, p.image].every(v => typeof v === "string" && v.length > 0)
    && Object.hasOwn(units, p.unit) && Number.isFinite(p.today) && p.today >= 0
    && !!p.change && ["up", "down", "flat"].includes(p.change.dir) && Number.isFinite(p.change.pct);
}

export function getMovers(products: Product[], direction: "up" | "down") {
  return products.filter(p => p.change.dir === direction)
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct) || a.id - b.id).slice(0, 6);
}

const endpoints = [
  "https://api.api-store.workers.dev/api/bazardor/products",
  "https://api.abcz.workers.dev/api/bazardor/products",
];

export async function fetchProducts(fetcher: typeof fetch = fetch): Promise<Product[]> {
  for (const endpoint of endpoints) {
    try {
      const response = await fetcher(endpoint, { signal: AbortSignal.timeout(8000), cache: "no-store" });
      if (!response.ok) throw new Error(`Product API returned ${response.status}`);
      const data: unknown = await response.json();
      if (!Array.isArray(data) || !data.every(isProduct)) throw new Error("Invalid product data");
      return data;
    } catch {
      // Try the assignment's alternate endpoint before reporting an outage.
    }
  }
  throw new Error("Product APIs are unavailable");
}

export type ProductSort = "default" | "price-asc" | "price-desc";

export function getCategoryProducts(products: Product[], category: string, sort: ProductSort = "default") {
  const selected = products.filter(product => product.category === category);
  if (sort === "price-asc") selected.sort((a, b) => a.today - b.today);
  if (sort === "price-desc") selected.sort((a, b) => b.today - a.today);
  return selected;
}

export type MarketPrice = { market: string; division: string; min: number; max: number };
export type ProductDetails = Product & { yesterday: number; markets: MarketPrice[] };

export function isMarketPrice(value: unknown): value is MarketPrice {
  if (!value || typeof value !== "object") return false;
  const market = value as MarketPrice;
  return typeof market.market === "string" && !!market.market && typeof market.division === "string"
    && Number.isFinite(market.min) && Number.isFinite(market.max) && market.min >= 0 && market.max >= market.min;
}

export function summarizeMarkets(markets: MarketPrice[]) {
  if (!markets.length) return null;
  return {
    min: Math.min(...markets.map(market => market.min)),
    max: Math.max(...markets.map(market => market.max)),
    average: markets.reduce((sum, market) => sum + (market.min + market.max) / 2, 0) / markets.length,
  };
}

export async function fetchProductDetails(slug: string, fetcher: typeof fetch = fetch): Promise<ProductDetails | null> {
  for (const endpoint of endpoints) {
    try {
      const response = await fetcher(endpoint, { signal: AbortSignal.timeout(8000), cache: "no-store" });
      if (!response.ok) throw new Error("Products unavailable");
      const data: unknown = await response.json();
      if (!Array.isArray(data) || !data.every(isProduct)) throw new Error("Invalid products");
      const product = data.find(item => item.slug === slug) as ProductDetails | undefined;
      if (!product) return null;
      if (!Number.isFinite(product.yesterday) || !Array.isArray(product.markets) || !product.markets.every(isMarketPrice)) throw new Error("Invalid market prices");
      return product;
    } catch {
      // Retry the alternate API for network failures or malformed market data.
    }
  }
  throw new Error("Product details are unavailable");
}
