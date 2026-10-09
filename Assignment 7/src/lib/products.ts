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
