import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        clerkUserId: userId,
      },
    });

    if (!project) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 });
    }

    const { projectId } = await params;
    
    // Parse JSON safely
    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { name, description, status, canvasJsonPath } = body;
    
    if (!name && description === undefined && status === undefined && canvasJsonPath === undefined) {
       return new NextResponse("Missing some fields to update", { status: 400 });
    }

    // Verify project belongs to user first
    const existingProject = await prisma.project.findUnique({
      where: {
        id: projectId,
        clerkUserId: userId,
      }
    });

    if (!existingProject) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(canvasJsonPath !== undefined && { canvasJsonPath }),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        clerkUserId: userId,
      },
    });

    if (!project) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedProject = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json(deletedProject);
  } catch (error) {
    console.error("[PROJECT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const PATCH = PUT;

