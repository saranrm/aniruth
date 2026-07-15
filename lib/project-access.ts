import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export type CurrentProjectIdentity = {
  userId: string
  primaryEmail: string | null
}

export async function getCurrentProjectIdentity(): Promise<CurrentProjectIdentity | null> {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await currentUser()

  return {
    userId,
    primaryEmail: user?.primaryEmailAddress?.emailAddress.toLowerCase() ?? null,
  }
}

export async function getProjectWithAccess(
  roomId: string,
  identity: CurrentProjectIdentity,
) {
  return prisma.project.findFirst({
    where: {
      id: roomId,
      OR: [
        { clerkUserId: identity.userId },
        ...(identity.primaryEmail
          ? [
              {
                collaborators: {
                  some: { email: identity.primaryEmail },
                },
              },
            ]
          : []),
      ],
    },
  })
}

export async function getAccessibleProjects(identity: CurrentProjectIdentity) {
  return prisma.project.findMany({
    where: {
      OR: [
        { clerkUserId: identity.userId },
        ...(identity.primaryEmail
          ? [
              {
                collaborators: {
                  some: { email: identity.primaryEmail },
                },
              },
            ]
          : []),
      ],
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, clerkUserId: true },
  })
}
