"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, MailPlus, Trash2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Collaborator = {
  id: string
  email: string
  displayName: string | null
  imageUrl: string | null
}

type ShareDialogProps = {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({ projectId, open, onOpenChange }: ShareDialogProps) {
  const router = useRouter()
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const loadCollaborators = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`)
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(typeof data === "string" ? data : "Unable to load collaborators")
      }

      setCollaborators(data.collaborators)
      setIsOwner(data.isOwner)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load collaborators")
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (open) {
      void loadCollaborators()
    }
  }, [loadCollaborators, open])

  async function inviteCollaborator(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(typeof data === "string" ? data : "Unable to invite collaborator")
      }

      setCollaborators((current) => {
        const withoutExisting = current.filter((collaborator) => collaborator.id !== data.id)
        return [...withoutExisting, data]
      })
      setEmail("")
      router.refresh()
      window.dispatchEvent(new CustomEvent("project-shared"))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to invite collaborator")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function removeCollaborator(collaboratorId: string) {
    setRemovingId(collaboratorId)
    setErrorMessage(null)

    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" },
      )

      if (!response.ok) {
        throw new Error(await response.text() || "Unable to remove collaborator")
      }

      setCollaborators((current) => current.filter((collaborator) => collaborator.id !== collaboratorId))
      router.refresh()
      window.dispatchEvent(new CustomEvent("project-shared"))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to remove collaborator")
    } finally {
      setRemovingId(null)
    }
  }

  async function copyProjectLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), 1600)
    } catch {
      setErrorMessage("Unable to copy the project link")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            {isOwner ? "Invite collaborators or share this project link." : "People with access to this project."}
          </DialogDescription>
        </DialogHeader>

        {isOwner ? (
          <form className="flex gap-2" onSubmit={inviteCollaborator}>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              aria-label="Collaborator email"
              disabled={isSubmitting}
            />
            <Button type="submit" size="icon" aria-label="Invite collaborator" disabled={isSubmitting || !email.trim()}>
              <MailPlus className="size-4" />
            </Button>
          </form>
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Collaborators</span>
            <Users className="size-4 text-muted-foreground" />
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading collaborators...</p>
          ) : collaborators.length === 0 ? (
            <p className="text-sm text-muted-foreground">No collaborators yet.</p>
          ) : (
            <ul className="space-y-2">
              {collaborators.map((collaborator) => (
                <li key={collaborator.id} className="flex min-w-0 items-center gap-3">
                  {collaborator.imageUrl ? (
                    <img
                      src={collaborator.imageUrl}
                      alt=""
                      className="size-8 shrink-0 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {(collaborator.displayName ?? collaborator.email).slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    {collaborator.displayName ? <p className="truncate text-sm font-medium">{collaborator.displayName}</p> : null}
                    <p className="truncate text-xs text-muted-foreground">{collaborator.email}</p>
                  </div>
                  {isOwner ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${collaborator.email}`}
                      disabled={removingId === collaborator.id}
                      onClick={() => void removeCollaborator(collaborator.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

        {isOwner ? (
          <Button type="button" variant="outline" className="w-full" onClick={() => void copyProjectLink()}>
            {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {isCopied ? "Copied!" : "Copy project link"}
          </Button>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
