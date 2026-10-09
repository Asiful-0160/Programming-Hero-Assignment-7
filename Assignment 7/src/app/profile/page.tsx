import type { Metadata } from "next";
import { requireSession } from "@/lib/require-session";
import { ProfilePanel } from "@/components/profile/profile-panel";

export const metadata: Metadata = { title: "আমার প্রোফাইল" };

export default async function ProfilePage() {
  await requireSession();
  return <ProfilePanel editing={false} />;
}
