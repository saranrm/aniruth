import Link from "next/link"
import { LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-foreground">
      <div className="flex max-w-sm flex-col items-center gap-5 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted/30">
          <LockKeyhole className="size-5 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-xl font-medium">Workspace unavailable</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This project does not exist or you do not have access to it.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/editor">Back to projects</Link>
        </Button>
      </div>
    </main>
  )
}
