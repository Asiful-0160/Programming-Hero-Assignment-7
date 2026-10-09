"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function AuthFeedback() {
  const search = useSearchParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const handled = useRef("");
  useEffect(() => {
    if (isPending) return;
    const message = search.get("error") === "social" ? "social" : search.get("reason") === "protected" ? "protected" : search.get("auth") === "success" && session ? "success" : "";
    if (!message || handled.current === message) return;
    handled.current = message;
    if (message === "success") toast.success("সফলভাবে সাইন ইন হয়েছে।");
    else toast.error(message === "protected" ? "এই পৃষ্ঠা দেখতে আগে সাইন ইন করুন।" : "সামাজিক অ্যাকাউন্টে সাইন ইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।");
    const url = new URL(window.location.href);
    url.searchParams.delete(message === "success" ? "auth" : message === "protected" ? "reason" : "error");
    router.replace(url.pathname + url.search + url.hash, { scroll: false });
  }, [search, session, isPending, router]);
  return null;
}
