import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"

import { getCurrentProjectIdentity, getProjectWithAccess } from "@/lib/project-access"
import { isDatabaseConfigured, prisma } from "@/lib/prisma"

type CollaboratorRouteContext = {
  params: Promise<{ projectId: string }>
}

type CollaboratorUser = {
  id: string
  email: string
  displayName: string | null
  imageUrl: string | null
}

async function enrichCollaborators(
  collaborators: Array<{ id: string; email: string }>,
): Promise<CollaboratorUser[]> {
  if (collaborators.length === 0) {
    return []
  }

  try {
    const client = await clerkClient()
    const users = await client.users.getUserList({
      emailAddress: collaborators.map(({ email }) => email),
      limit: collaborators.length,
    })
    const usersByEmail = new Map(
      users.data.flatMap((user) =>
        user.emailAddresses.map((address) => [
          address.emailAddress.toLowerCase(),
          user,
        ] as const),
      ),
    )

    return collaborators.map((collaborator) => {
      const user = usersByEmail.get(collaborator.email)

      return {
        id: collaborator.id,
        email: collaborator.email,
        displayName: user?.fullName ?? user?.username ?? null,
        imageUrl: user?.imageUrl ?? null,
      }
    })
  } catch (error) {
    console.error("[COLLABORATORS_ENRICH]", error)

    return collaborators.map((collaborator) => ({
      id: collaborator.id,
      email: collaborator.email,
      displayName: null,
      imageUrl: null,
    }))
  }
}

export async function GET(_request: Request, { params }: CollaboratorRouteContext) {
  try {
    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 })
    }

    const identity = await getCurrentProjectIdentity()

    if (!identity) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { projectId } = await params
    const project = await getProjectWithAccess(projectId, identity)

    if (!project) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const collaborators = await prisma.projectCollaborator.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      select: { id: true, email: true },
    })

    return NextResponse.json({
      collaborators: await enrichCollaborators(collaborators),
      isOwner: project.clerkUserId === identity.userId,
    })
  } catch (error) {
    console.error("[COLLABORATORS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(request: Request, { params }: CollaboratorRouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 })
    }

    const { projectId } = await params
    const project = await prisma.project.findFirst({
      where: { id: projectId, clerkUserId: userId },
      select: { id: true },
    })

    if (!project) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const body = await request.json().catch(() => null)
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return new NextResponse("A valid email address is required", { status: 400 })
    }

    const collaborator = await prisma.projectCollaborator.upsert({
      where: { projectId_email: { projectId, email } },
      update: {},
      create: { projectId, email },
      select: { id: true, email: true },
    })

    const [enrichedCollaborator] = await enrichCollaborators([collaborator])
    return NextResponse.json(enrichedCollaborator, { status: 201 })
  } catch (error) {
    console.error("[COLLABORATORS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
