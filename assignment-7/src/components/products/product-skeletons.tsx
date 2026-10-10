export function ProductSkeletons({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-busy="true">
      <p className="mb-5 text-sm text-slate-500">পণ্যের দাম লোড হচ্ছে…</p>
      <div aria-hidden="true" className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="skeleton mb-5 size-14" />
            <div className="skeleton mb-3 h-5 w-3/4" />
            <div className="skeleton mb-8 h-3 w-1/3" />
            <div className="skeleton h-7 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
