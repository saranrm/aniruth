import { SignIn } from "@clerk/nextjs"

import { clerkAppearance } from "@/lib/clerk/appearance"

const features = [
  "Draft with a focused editor surface",
  "Keep project context close at hand",
  "Return to your workspace securely",
]

export default function SignInPage() {
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
  )
}
