import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { ProductDetailsView } from "@/components/products/product-details";

export const metadata: Metadata = { title: "পণ্যের বিস্তারিত দাম" };

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?reason=protected");
  const { slug } = await params;
  return <ProductDetailsView key={slug} slug={slug} />;
}
