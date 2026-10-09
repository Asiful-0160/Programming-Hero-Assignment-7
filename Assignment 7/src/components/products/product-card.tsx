import Link from "next/link";
import { formatNumber, units, type Product } from "@/lib/products";
import { ChangeBadge } from "./change-badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-emerald-400 hover:bg-emerald-50/20">
      <div className="mb-5 flex items-start justify-between gap-2">
        <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-xl bg-stone-50 text-4xl">{product.image}</span>
        <span className="rounded-full bg-slate-50 px-2 py-1 text-[11px] text-slate-500">{product.categoryNameBn}</span>
      </div>
      <h3 className="text-base font-semibold text-slate-800 group-hover:text-emerald-800">{product.nameBn}</h3>
      <p className="mt-1 text-xs text-slate-500">প্রতি {units[product.unit]}</p>
      <div className="mt-auto pt-5">
        <p className="mb-2 text-xs text-slate-500">আজকের দাম</p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xl font-bold text-slate-900">{formatNumber(product.today)} <span className="text-sm font-medium">টাকা</span></p>
          <ChangeBadge change={product.change} />
        </div>
      </div>
    </Link>
  );
}
