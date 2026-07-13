import { SignIn } from "@clerk/nextjs";

import { clerkAppearance } from "@/lib/clerk/appearance";

const features = [
  "Draft with a focused editor surface",
  "Keep project context close at hand",
  "Return to your workspace securely",
];

const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

export default function SignInPage() {
  if (!isClerkConfigured) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16 text-foreground">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Authentication setup required
          </p>
          <h1 className="mt-3 text-2xl font-semibold">
            Clerk needs configuration before sign-in can load.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Add the Clerk publishable and secret key values to your environment
            to enable this experience.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh bg-background text-foreground">
      <section className="hidden w-1/2 flex-col justify-between border-r border-border px-12 py-10 lg:flex">
        <div className="text-sm font-medium tracking-normal text-foreground">
          Aniruth
        </div>

        <div className="max-w-md space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-normal">
              Continue to your writing workspace.
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Sign in to keep your editor, projects, and account settings tied
              to one secure session.
            </p>
          </div>

          <ul className="space-y-3 text-sm text-muted-foreground">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-muted-foreground">
          Protected by Clerk authentication.
        </div>
      </section>

      <section className="flex min-h-dvh flex-1 items-center justify-center px-4 py-8">
        <SignIn appearance={clerkAppearance} />
      </section>
    </main>
  );
}
