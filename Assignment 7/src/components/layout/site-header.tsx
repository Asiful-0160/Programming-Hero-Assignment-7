import { Suspense } from "react";
import Link from "next/link";
import { BengaliDate } from "./bengali-date";
import { CategoryNavigation } from "./category-navigation";
import { AuthNavigation } from "@/components/auth/auth-navigation";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="site-container flex flex-wrap items-center justify-between gap-x-3 gap-y-3 py-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-emerald-800 sm:text-2xl">
            <span aria-hidden="true">🛒</span>বাজার দর
          </Link>
          <BengaliDate />
        </div>
        <AuthNavigation />
      </div>
      <Suspense fallback={<div className="h-14 border-t border-slate-100" aria-hidden="true" />}><CategoryNavigation /></Suspense>
    </header>
  );
}
