"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { isProduct, type Product } from "@/lib/products";

type ProductsState = { products: Product[]; loading: boolean; error: string | null; retry: () => void };
const ProductsContext = createContext<ProductsState | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<ProductsState, "retry">>({ products: [], loading: true, error: null });
  const controller = useRef<AbortController | null>(null);
  const load = useCallback(async () => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setState(previous => ({ ...previous, loading: true, error: null }));
    try {
      const response = await fetch("/api/products", { signal: AbortSignal.any([request.signal, AbortSignal.timeout(20000)]), cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load products");
      const products: unknown = await response.json();
      if (!Array.isArray(products) || !products.every(isProduct)) throw new Error("Invalid response");
      if (!request.signal.aborted) setState({ products, loading: false, error: null });
    } catch {
      if (!request.signal.aborted) setState({ products: [], loading: false, error: "পণ্যের দাম লোড করা যায়নি। একটু পরে আবার চেষ্টা করুন।" });
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => { window.clearTimeout(timer); controller.current?.abort(); };
  }, [load]);
  return <ProductsContext.Provider value={{ ...state, retry: load }}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts requires ProductsProvider");
  return context;
}
