"use client"

import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { ProjectDialogController } from "@/components/editor/use-project-dialogs"

type ProjectDialogsProps = {
  controller: ProjectDialogController
}

export function ProjectDialogs({ controller }: ProjectDialogsProps) {
  const {
    dialog,
    isLoading,
    errorMessage,
    projectName,
    setProjectName,
    slugPreview,
    closeDialog,
    submitDialog,
  } = controller

  const isOpen = dialog.kind !== "closed"

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitDialog()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? closeDialog() : null)}>
      <DialogContent>
        {dialog.kind === "create" ? (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Name the workspace and confirm the generated slug.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="create-project-name">
                Project name
              </label>
              <Input
                id="create-project-name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Slug preview: <span className="text-foreground">{slugPreview}</span>
              </p>
              {errorMessage ? (
                <p role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={!projectName.trim() || isLoading}>
                Create Project
              </Button>
            </DialogFooter>
          </form>
        ) : null}

        {dialog.kind === "rename" ? (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Rename Project</DialogTitle>
              <DialogDescription>
                Current project: {dialog.project?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="rename-project-name">
                Project name
              </label>
              <Input
                id="rename-project-name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                autoFocus
              />
              {errorMessage ? (
                <p role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={!projectName.trim() || isLoading}>
                Rename Project
              </Button>
            </DialogFooter>
          </form>
        ) : null}

        {dialog.kind === "delete" ? (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Delete {dialog.project?.name}? This cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {errorMessage ? (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isLoading}>
                Delete Project
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
