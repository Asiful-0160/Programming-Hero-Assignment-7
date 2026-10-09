"use client";

import Link from "next/link";
import { useState } from "react";
import { useProducts } from "@/components/products/products-provider";
import { ProductCard } from "@/components/products/product-card";
import { ProductSkeletons } from "@/components/products/product-skeletons";
import { formatNumber, getCategoryProducts, type ProductSort } from "@/lib/products";

export function CategoryProducts({ slug }: { slug: string }) {
  const { products, loading, error, retry } = useProducts();
  const [sort, setSort] = useState<ProductSort>("default");
  const selected = getCategoryProducts(products, slug, sort);

  return (
    <section aria-label="বিভাগের পণ্য">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <p role="status" className="text-sm text-slate-500">
          {loading ? "দামের তথ্য আসছে…" : error ? "দামের তথ্য পাওয়া যায়নি" : `${formatNumber(selected.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`}
        </p>
        <div className="flex items-center gap-3">
          <label htmlFor={`category-sort-${slug}`} className="text-sm font-medium">সাজান:</label>
          <select id={`category-sort-${slug}`} value={sort} disabled={loading || !!error || !selected.length}
            onChange={event => setSort(event.target.value as ProductSort)}
            className="select select-bordered w-48 bg-white text-sm">
            <option value="default">ডিফল্ট</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>
      {loading ? <ProductSkeletons count={4} /> : error ? (
        <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold">দামের তথ্য পাওয়া যায়নি</h2>
          <p className="my-4 text-sm text-slate-600">{error}</p>
          <button type="button" onClick={retry} className="btn btn-primary">আবার চেষ্টা করুন</button>
        </div>
      ) : selected.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <span aria-hidden="true" className="text-5xl">🧺</span>
          <h2 className="mt-6 text-2xl font-semibold">এই বিভাগে কোনো পণ্য পাওয়া যায়নি</h2>
          <p className="mt-3 text-sm text-slate-500">অন্য বিভাগের পণ্যের দাম দেখতে হোম পেজে ফিরে যান।</p>
          <Link href="/" className="btn btn-primary mt-6">হোম পেজে ফিরে যান</Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {selected.map(product => <li key={product.id}><ProductCard product={product} /></li>)}
        </ul>
      )}
    </section>
  );
}
