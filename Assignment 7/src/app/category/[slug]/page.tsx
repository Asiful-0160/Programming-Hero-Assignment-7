import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/lib/categories";
import { CategoryProducts } from "@/components/category/category-products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map(category => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find(item => item.slug === slug);
  if (!category) notFound();
  return { title: `${category.name} — আজকের দাম`, description: `${category.name} বিভাগের পণ্যের আজকের দাম ও পরিবর্তন।` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find(item => item.slug === slug);
  if (!category) notFound();

  return (
    <div className="site-container py-8 sm:py-12">
      <nav aria-label="অবস্থান" className="mb-7 text-sm text-slate-500">
        <ol className="flex items-center gap-2"><li><Link href="/" className="hover:text-emerald-700">হোম</Link></li><li aria-hidden="true">/</li><li aria-current="page">{category.name}</li></ol>
      </nav>
      <header className="mb-8 flex items-center gap-4">
        <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-4xl">{category.icon}</span>
        <div><h1 className="text-3xl font-bold text-slate-900">{category.name}</h1><p className="mt-2 text-sm leading-6 text-slate-500">আজকের বাজারদর দেখুন, দামের তুলনা করুন।</p></div>
      </header>
      <CategoryProducts key={slug} slug={slug} />
    </div>
  );
}
