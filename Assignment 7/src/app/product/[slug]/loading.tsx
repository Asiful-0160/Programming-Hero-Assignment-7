export default function Loading() {
  return <div className="site-container py-12" role="status"><p className="mb-6 text-sm text-slate-500">পণ্যের বিস্তারিত লোড হচ্ছে…</p><div aria-hidden="true" className="space-y-6"><div className="skeleton h-32 w-full" /><div className="grid grid-cols-3 gap-4"><div className="skeleton h-24" /><div className="skeleton h-24" /><div className="skeleton h-24" /></div><div className="skeleton h-64 w-full" /></div></div>;
}
