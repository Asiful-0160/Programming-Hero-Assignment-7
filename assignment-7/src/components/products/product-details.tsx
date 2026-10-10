"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { formatNumber, summarizeMarkets, units, type ProductDetails } from "@/lib/products";
import { ChangeBadge } from "./change-badge";

type State = { status: "loading" } | { status: "error" } | { status: "missing" } | { status: "ready"; product: ProductDetails };

export function ProductDetailsView({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ status: "loading" });
  useEffect(() => {
    if (!isPending && !session) router.replace("/signin?reason=protected");
  }, [session, isPending, router]);
  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/products/${encodeURIComponent(slug)}`, { cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20000)]) });
        if (response.status === 401) { router.replace("/signin?reason=protected"); return; }
        if (response.status === 404) { setState({ status: "missing" }); return; }
        if (!response.ok) throw new Error("Prices unavailable");
        const product: ProductDetails = await response.json();
        if (!controller.signal.aborted) setState({ status: "ready", product });
      } catch { if (!controller.signal.aborted) setState({ status: "error" }); }
    }
    void load();
    return () => controller.abort();
  }, [slug, attempt, router, session]);

  if (isPending || !session || state.status === "loading") return <div className="site-container py-12" role="status"><p className="mb-6 text-sm text-slate-500">পণ্যের বিস্তারিত লোড হচ্ছে…</p><div aria-hidden="true" className="space-y-6"><div className="skeleton h-32 w-full" /><div className="skeleton h-24 w-full" /><div className="skeleton h-64 w-full" /></div></div>;
  if (state.status === "missing") return <section className="site-container py-20 text-center"><p className="text-6xl font-bold text-emerald-700">৪০৪</p><h1 className="mt-6 text-2xl font-bold">পণ্যটি খুঁজে পাওয়া যায়নি</h1><p className="mt-3 text-slate-500">অন্য পণ্যের দাম দেখতে হোম পেজে ফিরে যান।</p><Link href="/" className="btn btn-primary mt-6">হোম পেজে ফিরে যান</Link></section>;
  if (state.status === "error") return <section className="site-container py-16 text-center"><div role="alert"><h1 className="text-2xl font-bold">বাজারের দাম পাওয়া যাচ্ছে না</h1><p className="my-4 text-slate-500">সাময়িক সংযোগ সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।</p></div><button onClick={() => { setState({ status: "loading" }); setAttempt(value => value + 1); }} className="btn btn-primary">আবার চেষ্টা করুন</button></section>;

  const { product } = state;
  const summary = summarizeMarkets(product.markets);
  const difference = product.today - product.yesterday;
  return <article className="site-container space-y-8 py-8 sm:py-12">
    <nav aria-label="অবস্থান" className="text-sm text-slate-500"><ol className="flex flex-wrap gap-2"><li><Link href="/">হোম</Link></li><li aria-hidden="true">/</li><li><Link href={`/category/${product.category}`}>{product.categoryNameBn}</Link></li><li aria-hidden="true">/</li><li aria-current="page">{product.nameBn}</li></ol></nav>
    <header className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-5"><span aria-hidden="true" className="flex size-20 items-center justify-center rounded-2xl bg-emerald-50 text-5xl">{product.image}</span><div><h1 className="text-2xl font-bold sm:text-3xl">{product.nameBn}</h1><p className="mt-3 text-sm text-slate-500">প্রতি {units[product.unit]} · বাজারভিত্তিক আজকের দাম ও পরিবর্তন</p><Link href={`/category/${product.category}`} className="badge badge-outline mt-3 border-emerald-200 text-emerald-700">{product.categoryNameBn}</Link></div></div>
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6"><p className="text-sm text-slate-500">আজকের দাম <strong className="ml-3 text-2xl text-slate-900">{formatNumber(product.today)} টাকা</strong></p><ChangeBadge change={product.change} /></div>
      <p className="mt-3 text-sm text-slate-500">{difference === 0 ? "গতকালের তুলনায় আজ দাম অপরিবর্তিত।" : `গতকালের তুলনায় আজ দাম ${difference > 0 ? "বেড়েছে" : "কমেছে"} ${formatNumber(Math.abs(difference))} টাকা।`}</p>
    </header>
    <section aria-labelledby="price-summary"><h2 id="price-summary" className="mb-5 text-xl font-bold">দামের সারসংক্ষেপ</h2>
      {summary ? <><dl className="grid gap-4 sm:grid-cols-3">{[{ label: "সর্বনিম্ন দাম", value: summary.min }, { label: "সর্বাধিক দাম", value: summary.max }, { label: "গড় দাম", value: summary.average }].map(item => <div key={item.label} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-6"><dt className="text-sm text-slate-600">{item.label}</dt><dd className="mt-3 text-2xl font-bold text-emerald-800">{formatNumber(item.value)} <span className="text-sm font-medium">টাকা</span></dd></div>)}</dl><p className="mt-3 text-xs leading-6 text-slate-500">প্রতি {units[product.unit]}-এর হিসাবে। প্রতিটি বাজারের সর্বনিম্ন ও সর্বাধিক দামের মাঝামাঝি মানের গড় দেখানো হয়েছে।</p></> : <p className="text-sm text-slate-500">বাজারের তথ্য না থাকায় দামের সারসংক্ষেপ দেখানো যাচ্ছে না।</p>}
    </section>
    <section aria-labelledby="market-title"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 id="market-title" className="text-xl font-bold">বাজারভিত্তিক আজকের দাম</h2><p className="text-sm text-slate-500">{formatNumber(product.markets.length)}টি বাজার</p></div>
      {product.markets.length ? <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white" tabIndex={0} role="region" aria-label="বাজারের দাম, প্রয়োজনে পাশে স্ক্রল করুন"><table className="w-full min-w-[560px] text-left text-sm"><caption className="sr-only">{product.nameBn} — প্রতি {units[product.unit]} বাজারভিত্তিক দাম</caption><thead className="border-b border-slate-200 bg-slate-50 text-slate-600"><tr>{["বাজার", "বিভাগ", "সর্বনিম্ন", "সর্বাধিক", "গড়"].map(label => <th key={label} scope="col" className="px-5 py-4 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{product.markets.map((market, index) => <tr key={`${market.market}-${index}`} className="hover:bg-emerald-50/30"><th scope="row" className="px-5 py-4 font-medium">{market.market}</th><td className="px-5 py-4 text-slate-500">{market.division}</td><td className="whitespace-nowrap px-5 py-4">{formatNumber(market.min)} টাকা</td><td className="whitespace-nowrap px-5 py-4">{formatNumber(market.max)} টাকা</td><td className="whitespace-nowrap px-5 py-4 font-semibold text-emerald-700">{formatNumber((market.min + market.max) / 2)} টাকা</td></tr>)}</tbody></table></div> : <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">এই পণ্যের বাজারভিত্তিক তথ্য এখনো পাওয়া যায়নি।</p>}
    </section>
  </article>;
}
