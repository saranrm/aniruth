import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"

import { EditorHome } from "@/components/editor/editor-home"

export default async function EditorPage() {
  const { userId } = await auth()

  if (!userId) {
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

  const projects = await prisma.project.findMany({
    where: { clerkUserId: userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true },
  })

  return <EditorHome initialProjects={projects} />
}
