import { fetchProducts } from "@/lib/products";

export async function GET() {
  try {
    const products = (await fetchProducts()).map(({ id, slug, nameBn, category, categoryNameBn, unit, image, today, change }) => ({ id, slug, nameBn, category, categoryNameBn, unit, image, today, change }));
    return Response.json(products, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "এই মুহূর্তে পণ্যের দাম পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।" }, { status: 503 });
  }
}
