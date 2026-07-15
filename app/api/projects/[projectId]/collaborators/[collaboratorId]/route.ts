import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { isDatabaseConfigured, prisma } from "@/lib/prisma"

type RemoveCollaboratorContext = {
  params: Promise<{ projectId: string; collaboratorId: string }>
}

export async function DELETE(_request: Request, { params }: RemoveCollaboratorContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 })
    }

    const { projectId, collaboratorId } = await params
    const collaborator = await prisma.projectCollaborator.findFirst({
      where: {
        id: collaboratorId,
        projectId,
        project: { clerkUserId: userId },
      },
      select: { id: true },
    })

    if (!collaborator) {
      return new NextResponse("Not Found", { status: 404 })
    }

    await prisma.projectCollaborator.delete({ where: { id: collaborator.id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[COLLABORATORS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
