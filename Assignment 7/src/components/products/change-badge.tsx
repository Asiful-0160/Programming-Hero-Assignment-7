import { formatPercent, type Product } from "@/lib/products";

export function ChangeBadge({ change }: { change: Product["change"] }) {
  const styles = { up: "bg-emerald-50 text-emerald-700", down: "bg-red-50 text-red-700", flat: "bg-slate-100 text-slate-600" };
  const symbols = { up: "▲", down: "▼", flat: "—" };
  const labels = { up: "দাম বেড়েছে", down: "দাম কমেছে", flat: "দাম অপরিবর্তিত" };
  return <span aria-label={`${labels[change.dir]} ${formatPercent(change.pct)}%`} className={`inline-flex shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${styles[change.dir]}`}>{symbols[change.dir]} {formatPercent(change.pct)}%</span>;
}
