"use client"

import { useMemo, useState } from "react"

export type ProjectDialogProject = {
  id: string
  name: string
}

type DialogKind = "create" | "rename" | "delete"

type DialogState =
  | { kind: "closed"; project: null }
  | { kind: DialogKind; project: ProjectDialogProject | null }

type UseProjectDialogsOptions = {
  onCreateProject?: (name: string, slug: string) => Promise<void> | void
  onRenameProject?: (project: ProjectDialogProject, name: string) => Promise<void> | void
  onDeleteProject?: (project: ProjectDialogProject) => Promise<void> | void
}

function createSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "project-slug"
}

export function useProjectDialogs({
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: UseProjectDialogsOptions = {}) {
  const [dialog, setDialog] = useState<DialogState>({
    kind: "closed",
    project: null,
  })
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const slugPreview = useMemo(() => createSlug(projectName), [projectName])

  function closeDialog() {
    if (isLoading) {
      return
    }

    setDialog({ kind: "closed", project: null })
    setProjectName("")
    setErrorMessage(null)
  }

  function openCreateDialog() {
    setProjectName("")
    setErrorMessage(null)
    setDialog({ kind: "create", project: null })
  }

  function openRenameDialog(project: ProjectDialogProject) {
    setProjectName(project.name)
    setErrorMessage(null)
    setDialog({ kind: "rename", project })
  }

  function openDeleteDialog(project: ProjectDialogProject) {
    setProjectName("")
    setErrorMessage(null)
    setDialog({ kind: "delete", project })
  }

  async function submitDialog() {
    if (dialog.kind === "closed") {
      return
    }

    const trimmedName = projectName.trim()

    if ((dialog.kind === "create" || dialog.kind === "rename") && !trimmedName) {
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      if (dialog.kind === "create") {
        await onCreateProject?.(trimmedName, slugPreview)
      }

      if (dialog.kind === "rename" && dialog.project) {
        await onRenameProject?.(dialog.project, trimmedName)
      }

      if (dialog.kind === "delete" && dialog.project) {
        await onDeleteProject?.(dialog.project)
      }

      setDialog({ kind: "closed", project: null })
      setProjectName("")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    dialog,
    isLoading,
    errorMessage,
    projectName,
    setProjectName,
    slugPreview,
    closeDialog,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    submitDialog,
  }
}

export type ProjectDialogController = ReturnType<typeof useProjectDialogs>
