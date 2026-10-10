"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function ProfilePanel({ editing }: { editing: boolean }) {
  const { data: session, isPending, error: sessionError, refetch } = authClient.useSession();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!isPending && !session && !sessionError) router.replace("/signin?reason=protected");
  }, [isPending, session, sessionError, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const name = String(new FormData(event.currentTarget).get("name") || "").trim();
    if (!name || name.length > 100) {
      const message = "১ থেকে ১০০ অক্ষরের একটি নাম লিখুন।";
      setError(message); toast.error(message); return;
    }
    setBusy(true); setError(null);
    try {
      const result = await authClient.updateUser({ name });
      if (result.error) {
        if (result.error.status === 401) { router.replace("/signin?reason=protected"); return; }
        const message = "নাম আপডেট করা যায়নি। আবার চেষ্টা করুন।";
        setError(message); toast.error(message); return;
      }
      await refetch();
      toast.success("আপনার নাম আপডেট হয়েছে।");
      router.replace("/profile"); router.refresh();
    } catch {
      const message = "সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(message); toast.error(message);
    } finally { setBusy(false); }
  }

  if (sessionError) return <section role="alert" className="site-container py-16 text-center"><p className="mb-4">প্রোফাইল লোড করা যায়নি।</p><button onClick={() => refetch()} className="btn btn-primary">আবার চেষ্টা করুন</button></section>;
  if (isPending || !session) return <div role="status" className="site-container py-14"><p className="mb-5 text-sm text-slate-500">প্রোফাইল লোড হচ্ছে…</p><div aria-hidden="true" className="skeleton mx-auto h-72 max-w-xl" /></div>;

  return <div className="site-container py-10 sm:py-14"><section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
    <div className="mb-7 flex items-center gap-4"><span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-2xl font-bold text-emerald-800">{Array.from(session.user.name)[0] || "👤"}</span><div><h1 className="text-2xl font-bold">{editing ? "প্রোফাইল আপডেট" : "আমার প্রোফাইল"}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{editing ? "আপনার নতুন নাম লিখে সংরক্ষণ করুন।" : "আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।"}</p></div></div>
    {editing ? <form key={session.user.name} onSubmit={submit} noValidate>
      <label htmlFor="profile-edit-name" className="mb-2 block text-sm font-medium">নাম</label>
      <input id="profile-edit-name" name="name" autoComplete="name" defaultValue={session.user.name} required maxLength={100} disabled={busy} aria-describedby={error ? "profile-edit-error" : undefined} className="input input-bordered w-full" />
      {error && <p id="profile-edit-error" role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-7 flex flex-wrap gap-3"><button type="submit" disabled={busy} className="btn btn-primary">{busy ? "সংরক্ষণ হচ্ছে…" : "তথ্য আপডেট করুন"}</button><Link href="/profile" className="btn btn-ghost">ফিরে যান</Link></div>
    </form> : <><dl className="space-y-5 border-y border-slate-100 py-6"><div><dt className="text-xs text-slate-500">নাম</dt><dd className="mt-2 break-words font-semibold" data-testid="profile-name">{session.user.name}</dd></div><div><dt className="text-xs text-slate-500">ইমেইল</dt><dd className="mt-2 break-all text-sm" dir="ltr">{session.user.email}</dd></div></dl><div className="mt-7 flex flex-wrap gap-3"><Link href="/profile/edit" className="btn btn-primary">তথ্য আপডেট করুন</Link><Link href="/" className="btn btn-ghost">হোম পেজে ফিরে যান</Link></div></>}
  </section></div>;
}
