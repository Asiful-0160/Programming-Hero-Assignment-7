"use client";

import { useState } from "react";
import { useProducts } from "@/components/products/products-provider";
import { formatNumber, formatPercent, units } from "@/lib/products";

export function PriceTicker() {
  const { products, loading, error } = useProducts();
  const [paused, setPaused] = useState(false);
  if (loading) return <div role="status" className="border-b border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-xs text-emerald-800">আজকের দাম লোড হচ্ছে…</div>;
  if (error || products.length === 0) return <div className="border-b border-slate-200 px-4 py-3 text-center text-xs text-slate-500">এই মুহূর্তে দামের তথ্য পাওয়া যাচ্ছে না।</div>;
  return (
    <section aria-label="আজকের বাজারদর" className="flex items-center border-b border-emerald-100 bg-emerald-50/70">
      <div className={`ticker-window min-w-0 flex-1 overflow-hidden ${paused ? "ticker-paused" : ""}`}>
        <div className="ticker-track flex w-max">
          {[0, 1].map(copy => <ul key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 items-center">
            {products.map(product => <li key={product.id} className="flex items-center gap-2 whitespace-nowrap px-5 py-3 text-xs">
              <span aria-hidden="true">{product.image}</span><span className="font-medium">{product.nameBn}</span>
              <span>{formatNumber(product.today)} টাকা/{units[product.unit]}</span>
              <span className={product.change.dir === "up" ? "text-emerald-700" : product.change.dir === "down" ? "text-red-700" : "text-slate-500"}>{product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—"} {formatPercent(product.change.pct)}%</span>
            </li>)}
          </ul>)}
        </div>
      </div>
      <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} className="ticker-control shrink-0 border-l border-emerald-200 px-3 py-3 text-xs font-medium text-emerald-800">{paused ? "চালু করুন" : "থামান"}</button>
    </section>
  );
}
