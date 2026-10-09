export type AuthFields = { name?: string; email: string; password: string; confirmPassword?: string };

export function validateAuthFields(mode: "signin" | "signup", fields: AuthFields) {
  if (mode === "signup" && (!fields.name?.trim() || fields.name.trim().length > 100)) return "১ থেকে ১০০ অক্ষরের একটি নাম লিখুন।";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) return "একটি সঠিক ইমেইল ঠিকানা লিখুন।";
  if (fields.password.length < 8 || fields.password.length > 128) return "পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের হতে হবে।";
  if (mode === "signup" && fields.password !== fields.confirmPassword) return "পাসওয়ার্ড দুটি মিলছে না।";
  return null;
}

export function authErrorMessage(code?: string) {
  if (code === "INVALID_EMAIL_OR_PASSWORD") return "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।";
  if (code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") return "এই ইমেইলে অ্যাকাউন্ট রয়েছে। সাইন ইন করুন।";
  if (code === "PASSWORD_TOO_SHORT" || code === "PASSWORD_TOO_LONG") return "পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের হতে হবে।";
  if (code === "TOO_MANY_REQUESTS") return "অনেকবার চেষ্টা করা হয়েছে। একটু পরে আবার চেষ্টা করুন।";
  return "অনুরোধটি সম্পন্ন করা যায়নি। একটু পরে আবার চেষ্টা করুন।";
}
