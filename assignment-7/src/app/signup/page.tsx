import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "সাইন আপ" };

export default function SignUpPage() {
  return <div className="site-container py-10 sm:py-14"><AuthForm mode="signup" googleEnabled={!!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} githubEnabled={!!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)} /></div>;
}
