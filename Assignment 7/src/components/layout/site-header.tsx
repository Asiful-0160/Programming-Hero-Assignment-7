import Link from "next/link";
import { BengaliDate } from "./bengali-date";
import { CategoryNavigation } from "./category-navigation";

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
        <div className="flex items-center gap-2">
          <Link href="/signin" className="btn btn-ghost btn-sm min-h-10 px-3 text-emerald-800">সাইন ইন</Link>
          <Link href="/signup" className="btn btn-primary btn-sm min-h-10 px-3 sm:px-4">সাইন আপ</Link>
        </div>
      </div>
      <CategoryNavigation />
    </header>
  );
}
