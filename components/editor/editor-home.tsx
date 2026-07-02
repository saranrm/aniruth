"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EditorLayout } from "@/components/editor/editor-layout"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import {
  type ProjectDialogProject,
  useProjectDialogs,
} from "@/components/editor/use-project-dialogs"

const initialProjects: ProjectDialogProject[] = [
  { id: "atelier-residence", name: "Atelier Residence" },
  { id: "urban-courtyard", name: "Urban Courtyard" },
]

export function EditorHome() {
  const [projects, setProjects] = useState(initialProjects)

  const dialogs = useProjectDialogs({
    onCreateProject: (name, slug) => {
      setProjects((current) => [...current, { id: slug, name }])
    },
    onRenameProject: (project, name) => {
      setProjects((current) =>
        current.map((item) =>
          item.id === project.id ? { ...item, name } : item
        )
      )
    },
    onDeleteProject: (project) => {
      setProjects((current) => current.filter((item) => item.id !== project.id))
    },
  })

  return (
    <EditorLayout
      projects={projects}
      onCreateProject={dialogs.openCreateDialog}
      onRenameProject={dialogs.openRenameDialog}
      onDeleteProject={dialogs.openDeleteDialog}
    >
      <div className="flex min-h-full items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-xl justify-items-center gap-4 text-center">
          <h1 className="font-heading text-2xl font-medium tracking-normal text-foreground sm:text-3xl">
            Create a project or open an existing one
          </h1>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <Button type="button" size="lg" onClick={dialogs.openCreateDialog}>
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
      </div>

      <ProjectDialogs controller={dialogs} />
    </EditorLayout>
  )
}
