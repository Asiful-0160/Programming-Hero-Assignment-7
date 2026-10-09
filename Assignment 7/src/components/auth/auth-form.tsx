"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage, validateAuthFields } from "@/lib/auth-validation";

type Props = { mode: "signin" | "signup"; googleEnabled: boolean; githubEnabled: boolean };

export function AuthForm({ mode, googleEnabled, githubEnabled }: Props) {
  const signup = mode === "signup";
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  function report(message: string) { setError(message); toast.error(message); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const fields = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      password: String(data.get("password") || ""),
      confirmPassword: String(data.get("confirmPassword") || ""),
    };
    const invalid = validateAuthFields(mode, fields);
    if (invalid) { report(invalid); return; }
    setBusy("email"); setError(null);
    try {
      const result = signup
        ? await authClient.signUp.email({ name: fields.name, email: fields.email, password: fields.password })
        : await authClient.signIn.email({ email: fields.email, password: fields.password });
      if (result.error) { report(authErrorMessage(result.error.code)); return; }
      toast.success(signup ? "নিবন্ধনের অনুরোধ সম্পন্ন হয়েছে। এবার সাইন ইন করুন।" : "সফলভাবে সাইন ইন হয়েছে।");
      router.replace(signup ? "/signin" : "/");
      router.refresh();
    } catch { report("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।"); }
    finally { setBusy(null); }
  }

  async function social(provider: "google" | "github") {
    if (busy) return;
    setBusy(provider); setError(null);
    try {
      const result = await authClient.signIn.social({ provider, callbackURL: "/?auth=success", errorCallbackURL: "/signin?error=social" });
      if (result.error) { report(authErrorMessage(result.error.code)); setBusy(null); }
    } catch { report("সামাজিক অ্যাকাউন্টে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।"); setBusy(null); }
  }

  if (sessionPending) return <div role="status" className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8"><p className="mb-5 text-sm text-slate-500">অ্যাকাউন্টের তথ্য দেখা হচ্ছে…</p><div aria-hidden="true" className="space-y-5"><div className="skeleton h-8 w-1/2" /><div className="skeleton h-12 w-full" /><div className="skeleton h-12 w-full" /></div></div>;
  if (session) return <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center"><h1 className="text-2xl font-bold">আপনি সাইন ইন করেছেন</h1><p className="mt-3 break-words text-slate-600">স্বাগতম, {session.user.name}</p><Link href="/" className="btn btn-primary mt-6">হোম পেজে ফিরে যান</Link></section>;

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7 text-center"><span aria-hidden="true" className="text-3xl">🛒</span><h1 className="mt-4 text-2xl font-bold">{signup ? "সাইন আপ" : "সাইন ইন"}</h1><p className="mt-3 text-sm leading-6 text-slate-500">{signup ? "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।" : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"}</p></div>
      <form onSubmit={submit} noValidate aria-describedby={error ? `${mode}-error` : undefined}>
        <fieldset disabled={!!busy} className="space-y-5">
          {signup && <div><label htmlFor={`${mode}-name`} className="mb-2 block text-sm font-medium">নাম</label><input id={`${mode}-name`} name="name" autoComplete="name" maxLength={100} required className="input input-bordered w-full" placeholder="যেমন: রহিম উদ্দিন" /></div>}
          <div><label htmlFor={`${mode}-email`} className="mb-2 block text-sm font-medium">ইমেইল</label><input id={`${mode}-email`} name="email" type="email" autoComplete="email" required className="input input-bordered w-full" placeholder="you@example.com" dir="ltr" /></div>
          <div><label htmlFor={`${mode}-password`} className="mb-2 block text-sm font-medium">পাসওয়ার্ড</label><input id={`${mode}-password`} name="password" type={visible ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} minLength={8} maxLength={128} required className="input input-bordered w-full" placeholder="কমপক্ষে ৮ অক্ষর" aria-describedby={`${mode}-password-help`} /><p id={`${mode}-password-help`} className="mt-2 text-xs text-slate-500">৮ থেকে ১২৮ অক্ষর ব্যবহার করুন।</p></div>
          {signup && <div><label htmlFor={`${mode}-confirm-password`} className="mb-2 block text-sm font-medium">পাসওয়ার্ড নিশ্চিত করুন</label><input id={`${mode}-confirm-password`} name="confirmPassword" type={visible ? "text" : "password"} autoComplete="new-password" required className="input input-bordered w-full" placeholder="আবার লিখুন" /></div>}
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"><input type="checkbox" className="checkbox checkbox-sm" checked={visible} onChange={event => setVisible(event.target.checked)} />পাসওয়ার্ড দেখুন</label>
          {error && <p id={`${mode}-error`} role="alert" className="rounded-lg bg-red-50 p-3 text-sm leading-6 text-red-700">{error}</p>}
          <button type="submit" className="btn btn-primary min-h-12 w-full">{busy === "email" ? <><span className="loading loading-spinner loading-xs" aria-hidden="true" />অপেক্ষা করুন…</> : signup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}</button>
        </fieldset>
      </form>
      <div className="divider my-6 text-xs text-slate-400">অথবা</div>
      <div className="space-y-3">
        {([{ id: "google", label: "Google", enabled: googleEnabled }, { id: "github", label: "GitHub", enabled: githubEnabled }] as const).map(provider => (
          <button key={provider.id} type="button" onClick={() => social(provider.id)} disabled={!!busy || !provider.enabled} title={!provider.enabled ? "এই মুহূর্তে উপলব্ধ নয়" : undefined} className="btn btn-outline min-h-12 w-full border-slate-200 text-slate-700">
            {busy === provider.id ? "সংযোগ হচ্ছে…" : `${provider.label} দিয়ে চালিয়ে যান`}
            {!provider.enabled && <span className="text-[10px]">(শীঘ্রই)</span>}
          </button>
        ))}
      </div>
      <p className="mt-7 text-center text-sm text-slate-500">{signup ? "অ্যাকাউন্ট আছে? " : "অ্যাকাউন্ট নেই? "}<Link href={signup ? "/signin" : "/signup"} className="font-semibold text-emerald-700 hover:underline">{signup ? "সাইন ইন করুন" : "সাইন আপ করুন"}</Link></p>
    </section>
  );
}
