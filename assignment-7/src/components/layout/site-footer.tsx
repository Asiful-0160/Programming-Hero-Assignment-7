export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="site-container flex flex-col gap-3 py-6 text-center text-xs leading-6 text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p><span className="font-semibold text-emerald-800">বাজার দর</span> — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
        <p className="sm:max-w-sm sm:text-right">সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
      </div>
    </footer>
  );
}
