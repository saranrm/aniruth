import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

export default async function Home() {
  if (!isClerkConfigured) {
    redirect(signInUrl);
  }

  const { userId } = await auth();

  redirect(userId ? "/editor" : signInUrl);
}
