import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { EditorWorkspace } from "@/components/editor/editor-workspace"
import {
  getAccessibleProjects,
  getCurrentProjectIdentity,
  getProjectWithAccess,
} from "@/lib/project-access"
import { isDatabaseConfigured } from "@/lib/prisma"

type WorkspacePageProps = {
  params: Promise<{ roomId: string }>
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const identity = await getCurrentProjectIdentity()

  if (!identity) {
    redirect("/sign-in")
  }

  if (!isDatabaseConfigured()) {
    return <AccessDenied />
  }

  const { roomId } = await params
  const [project, projects] = await Promise.all([
    getProjectWithAccess(roomId, identity),
    getAccessibleProjects(identity),
  ])

  if (!project) {
    return <AccessDenied />
  }

  return (
    <EditorWorkspace
      project={{ id: project.id, name: project.name }}
      initialProjects={projects
        .filter((listedProject) => listedProject.clerkUserId === identity.userId)
        .map(({ id, name }) => ({ id, name }))}
      initialSharedProjects={projects
        .filter((listedProject) => listedProject.clerkUserId !== identity.userId)
        .map(({ id, name }) => ({ id, name }))}
    />
  )
}
