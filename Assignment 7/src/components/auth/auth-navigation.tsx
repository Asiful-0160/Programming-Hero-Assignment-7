"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function AuthNavigation() {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function signOut() {
    setBusy(true);
    try {
      const result = await authClient.signOut();
      if (result.error) { toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।"); return; }
      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.replace("/"); router.refresh();
    } catch { toast.error("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।"); }
    finally { setBusy(false); }
  }
  if (isPending) return <div role="status" aria-label="অ্যাকাউন্ট লোড হচ্ছে" className="skeleton h-10 w-36" />;
  if (error) return <button onClick={() => refetch()} className="btn btn-ghost btn-sm text-xs">অ্যাকাউন্ট আবার লোড করুন</button>;
  if (session) return <div className="flex flex-wrap items-center gap-2"><Link href="/profile" className="btn btn-ghost btn-sm min-h-10 max-w-44 text-emerald-800"><span aria-hidden="true">👤</span><span className="truncate">{session.user.name || "আমার প্রোফাইল"}</span></Link><button type="button" disabled={busy} onClick={signOut} className="btn btn-outline btn-sm min-h-10 border-slate-200">{busy ? "অপেক্ষা করুন…" : "সাইন আউট"}</button></div>;
  return <div className="flex items-center gap-2"><Link href="/signin" className="btn btn-ghost btn-sm min-h-10 px-3 text-emerald-800">সাইন ইন</Link><Link href="/signup" className="btn btn-primary btn-sm min-h-10 px-3 sm:px-4">সাইন আপ</Link></div>;
}
