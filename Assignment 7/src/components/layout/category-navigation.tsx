"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/categories";

const links = [{ href: "/", name: "হোম", icon: "⌂" }, ...categories.map(category => ({
  href: `/category/${category.slug}`, name: category.name, icon: category.icon,
}))];

export function CategoryNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="পণ্যের বিভাগ" className="border-t border-slate-100">
      <div className="site-container">
        <ul className="flex gap-1 overflow-x-auto py-2 [-webkit-overflow-scrolling:touch]">
          {links.map(link => {
            const active = pathname === link.href;
            return (
              <li key={link.href} className="shrink-0">
                <Link href={link.href} aria-current={active ? "page" : undefined}
                  className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors sm:px-4 ${active ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"}`}>
                  <span aria-hidden="true">{link.icon}</span>{link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
