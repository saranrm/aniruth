"use client"

import { CollaborativeCanvas } from "@/components/editor/collaborative-canvas"
import { EditorLayout } from "@/components/editor/editor-layout"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import type { ProjectDialogProject } from "@/components/editor/use-project-dialogs"
import { useProjectActions } from "@/hooks/use-project-actions"

type EditorWorkspaceProps = {
  initialProjects: ProjectDialogProject[]
  initialSharedProjects: ProjectDialogProject[]
  project: {
    id: string
    name: string
  }
}

export function EditorWorkspace({ initialProjects, initialSharedProjects, project }: EditorWorkspaceProps) {
  const dialogs = useProjectActions()

  return (
    <EditorLayout
      projects={initialProjects}
      sharedProjects={initialSharedProjects}
      onCreateProject={dialogs.openCreateDialog}
      onRenameProject={dialogs.openRenameDialog}
      onDeleteProject={dialogs.openDeleteDialog}
      workspace={{ projectId: project.id, projectName: project.name }}
    >
      <div className="absolute inset-0">
        <CollaborativeCanvas roomId={project.id} />
      </div>
      <ProjectDialogs controller={dialogs} />
    </EditorLayout>
  )
}
