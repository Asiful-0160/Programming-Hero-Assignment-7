import type { Metadata } from "next";
import { requireSession } from "@/lib/require-session";
import { ProfilePanel } from "@/components/profile/profile-panel";

export const metadata: Metadata = { title: "প্রোফাইল আপডেট" };

export default async function EditProfilePage() {
  await requireSession();
  return <ProfilePanel editing />;
}
