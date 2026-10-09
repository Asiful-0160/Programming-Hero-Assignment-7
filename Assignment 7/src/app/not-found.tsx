import Link from "next/link";

export default function NotFound() {
  return (
    <section className="site-container flex flex-1 flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-bold text-emerald-700">৪০৪</p>
      <h1 className="mt-6 text-2xl font-bold">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">লিংকটি সঠিক নয় অথবা এই বিভাগ বা পৃষ্ঠাটি আর পাওয়া যাচ্ছে না।</p>
      <Link href="/" className="btn btn-primary mt-7">হোম পেজে ফিরে যান</Link>
    </section>
  );
}
