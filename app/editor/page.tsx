import { redirect } from "next/navigation"
import { isDatabaseConfigured } from "@/lib/prisma"
import { getAccessibleProjects, getCurrentProjectIdentity } from "@/lib/project-access"

import { EditorHome } from "@/components/editor/editor-home"

export default async function EditorPage() {
  const identity = await getCurrentProjectIdentity()

  if (!identity) {
    redirect("/sign-in")
  }

  if (!isDatabaseConfigured()) {
    return (
      <EditorHome
        initialProjects={[]}
        projectPersistenceDisabledReason="Project storage is not configured. Add DATABASE_URL and run the Prisma migration to create projects."
      />
    )
  }

  const projects = await getAccessibleProjects(identity)

  return (
    <EditorHome
      initialProjects={projects
        .filter((project) => project.clerkUserId === identity.userId)
        .map(({ id, name }) => ({ id, name }))}
      initialSharedProjects={projects
        .filter((project) => project.clerkUserId !== identity.userId)
        .map(({ id, name }) => ({ id, name }))}
    />
  )
}
