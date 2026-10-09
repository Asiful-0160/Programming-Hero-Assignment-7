"use client";

export default function Error({ retry }: { retry: () => void }) {
  return <section className="site-container py-16 text-center"><h1 className="text-2xl font-bold">প্রোফাইল লোড করা যায়নি</h1><p className="my-4 text-slate-500">সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।</p><button type="button" onClick={retry} className="btn btn-primary">আবার চেষ্টা করুন</button></section>;
}
