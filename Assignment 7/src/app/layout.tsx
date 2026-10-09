import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "বাজার দর | BazarDor", template: "%s | বাজার দর" },
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" data-theme="light">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
