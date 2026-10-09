import { fetchProducts } from "@/lib/products";

export async function GET() {
  try {
    return Response.json(await fetchProducts(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "এই মুহূর্তে পণ্যের দাম পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।" }, { status: 503 });
  }
}
