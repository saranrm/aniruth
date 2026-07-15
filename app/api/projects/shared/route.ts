import { NextResponse } from "next/server";
import { getCurrentProjectIdentity } from "@/lib/project-access";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const identity = await getCurrentProjectIdentity();

    if (!identity) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 });
    }

    if (!identity.primaryEmail) {
      return NextResponse.json([]);
    }

    const sharedProjects = await prisma.project.findMany({
      where: {
        // Not owned by the current user
        NOT: { clerkUserId: identity.userId },
        // But the user is a collaborator
        collaborators: {
          some: { email: identity.primaryEmail },
        },
      },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true },
    });

    return NextResponse.json(sharedProjects);
  } catch (error) {
    console.error("[SHARED_PROJECTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
