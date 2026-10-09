"use client";

import { useProducts } from "@/components/products/products-provider";
import { ProductCard } from "@/components/products/product-card";
import { formatNumber, getMovers, type Product } from "@/lib/products";

function ProductGrid({ products }: { products: Product[] }) {
  return <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map(product => <li key={product.id}><ProductCard product={product} /></li>)}</ul>;
}

export function HomeProducts() {
  const { products, loading, error, retry } = useProducts();
  if (loading) return <div id="সব-পণ্য" className="site-container pb-16" role="status" aria-busy="true">
    <p className="mb-5 text-sm text-slate-500">পণ্যের দাম লোড হচ্ছে…</p>
    <div aria-hidden="true" className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <div key={i} className="rounded-xl border border-slate-200 bg-white p-5"><div className="skeleton mb-5 size-14" /><div className="skeleton mb-3 h-5 w-3/4" /><div className="skeleton mb-8 h-3 w-1/3" /><div className="skeleton h-7 w-2/3" /></div>)}</div>
  </div>;
  if (error) return <section id="সব-পণ্য" className="site-container pb-16"><div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-8 text-center"><h2 className="text-xl font-semibold">দামের তথ্য পাওয়া যায়নি</h2><p className="my-4 text-sm text-slate-600">{error}</p><button type="button" onClick={retry} className="btn btn-primary">আবার চেষ্টা করুন</button></div></section>;
  return <div className="site-container space-y-12 pb-16">
    {(["up", "down"] as const).map(direction => {
      const movers = getMovers(products, direction);
      return <section key={direction} aria-labelledby={`movers-${direction}`}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2"><h2 id={`movers-${direction}`} className="text-xl font-bold sm:text-2xl">{direction === "up" ? "আজ দাম বেড়েছে" : "আজ দাম কমেছে"} <span className={direction === "up" ? "text-emerald-600" : "text-red-600"} aria-hidden="true">{direction === "up" ? "▲" : "▼"}</span></h2><p className="text-xs text-slate-500">গতকালের তুলনায় সর্বোচ্চ পরিবর্তন</p></div>
        {movers.length ? <ProductGrid products={movers} /> : <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">এই বিভাগে আজ কোনো পণ্য নেই।</p>}
      </section>;
    })}
    <section id="সব-পণ্য" aria-labelledby="all-products-title" className="scroll-mt-6">
      <div className="mb-6"><h2 id="all-products-title" className="text-2xl font-bold">সব পণ্য</h2><p className="mt-2 text-sm text-slate-500">নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম ও পরিবর্তন</p></div>
      {products.length ? <ProductGrid products={products} /> : <p className="rounded-xl border border-slate-200 bg-white p-8 text-center">এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।</p>}
      <p className="mt-6 text-center text-xs text-slate-500">মোট {formatNumber(products.length)}টি পণ্য দেখানো হচ্ছে</p>
    </section>
  </div>;
}
