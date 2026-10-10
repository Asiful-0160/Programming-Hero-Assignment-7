import Image from "next/image";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="site-container py-8 sm:py-12">
      <div className="grid items-center gap-8 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/70 px-6 py-10 sm:px-10 lg:grid-cols-[1.6fr_1fr] lg:px-12">
        <div>
          <p className="mb-4 text-sm font-semibold text-emerald-700">নিত্যদিনের বাজার, প্রতিদিনের খবর</p>
          <h1 id="hero-title" className="max-w-xl text-3xl font-bold leading-snug tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">আজকের বাজারের দাম <span className="text-emerald-700">এক নজরে</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
          <a href="#সব-পণ্য" className="btn btn-primary mt-7 min-h-12 px-6">সব পণ্য দেখুন <span aria-hidden="true">↓</span></a>
        </div>
        <Image src="/images/bazar-hero.png" alt="তাজা ফল ও সবজির ঝুড়ি" width={260} height={260} sizes="(max-width: 640px) 180px, 260px" priority className="mx-auto h-auto w-44 sm:w-64" />
      </div>
    </section>
  );
}
