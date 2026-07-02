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
  onCreateProject?: (name: string, slug: string) => void
  onRenameProject?: (project: ProjectDialogProject, name: string) => void
  onDeleteProject?: (project: ProjectDialogProject) => void
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

  const slugPreview = useMemo(() => createSlug(projectName), [projectName])

  function closeDialog() {
    if (isLoading) {
      return
    }

    setDialog({ kind: "closed", project: null })
    setProjectName("")
  }

  function openCreateDialog() {
    setProjectName("")
    setDialog({ kind: "create", project: null })
  }

  function openRenameDialog(project: ProjectDialogProject) {
    setProjectName(project.name)
    setDialog({ kind: "rename", project })
  }

  function openDeleteDialog(project: ProjectDialogProject) {
    setProjectName("")
    setDialog({ kind: "delete", project })
  }

  function submitDialog() {
    if (dialog.kind === "closed") {
      return
    }

    const trimmedName = projectName.trim()

    if ((dialog.kind === "create" || dialog.kind === "rename") && !trimmedName) {
      return
    }

    setIsLoading(true)

    try {
      if (dialog.kind === "create") {
        onCreateProject?.(trimmedName, slugPreview)
      }

      if (dialog.kind === "rename" && dialog.project) {
        onRenameProject?.(dialog.project, trimmedName)
      }

      if (dialog.kind === "delete" && dialog.project) {
        onDeleteProject?.(dialog.project)
      }

      setDialog({ kind: "closed", project: null })
      setProjectName("")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    dialog,
    isLoading,
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
