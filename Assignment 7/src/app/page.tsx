import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50/50 px-6 py-16">
      <section className="card w-full max-w-xl border border-emerald-100 bg-base-100 shadow-sm">
        <div className="card-body items-center gap-6 p-8 text-center sm:p-12">
          <Image src="/images/bazar-hero.png" alt="তাজা ফল ও সবজির ঝুড়ি" width={260} height={260} priority />
          <h1 className="text-4xl font-bold text-emerald-800">বাজার দর</h1>
          <p className="text-lg text-slate-600">প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
          <p className="text-sm text-slate-500">শীঘ্রই আসছে</p>
        </div>
      </section>
    </main>
  );
}
