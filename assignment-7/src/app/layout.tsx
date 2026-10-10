import { Suspense } from "react";
import { AuthFeedback } from "@/components/auth/auth-feedback";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "@fontsource/noto-sans-bengali/400.css";
import "@fontsource/noto-sans-bengali/500.css";
import "@fontsource/noto-sans-bengali/600.css";
import "@fontsource/noto-sans-bengali/700.css";
import { ProductsProvider } from "@/components/products/products-provider";
import { PriceTicker } from "@/components/layout/price-ticker";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "বাজার দর | BazarDor", template: "%s | বাজার দর" },
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
  icons: { icon: "/images/logo-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" data-theme="light">
      <body className="flex min-h-screen flex-col antialiased">
        <a href="#main-content" className="skip-link">মূল বিষয়বস্তুতে যান</a>
        <ProductsProvider>
        <SiteHeader />
        <PriceTicker />
        <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
        </ProductsProvider>
        <Suspense fallback={null}><AuthFeedback /></Suspense>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
