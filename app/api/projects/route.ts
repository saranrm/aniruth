import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { getAccessibleProjects, getCurrentProjectIdentity } from "@/lib/project-access";

export async function GET() {
  try {
    const identity = await getCurrentProjectIdentity();

    if (!identity) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 });
    }

    const projects = await getAccessibleProjects(identity);

    return NextResponse.json(
      projects.map((project) => ({
        ...project,
        isOwner: project.clerkUserId === identity.userId,
      })),
    );
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 });
    }

    const body = await req.json();
    const { id, name, description } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        ...(id && { id }),
        clerkUserId: userId,
        name,
        description,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
