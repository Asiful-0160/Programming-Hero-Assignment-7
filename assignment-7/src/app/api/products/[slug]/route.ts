import { getAuth } from "@/lib/auth";
import { fetchProductDetails } from "@/lib/products";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const headers = { "Cache-Control": "private, no-store" };
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in required" }, { status: 401, headers });
  const { slug } = await params;
  try {
    const product = await fetchProductDetails(slug);
    if (!product) return Response.json({ error: "Product not found" }, { status: 404, headers });
    return Response.json(product, { headers });
  } catch {
    return Response.json({ error: "Market prices are temporarily unavailable" }, { status: 503, headers });
  }
}
