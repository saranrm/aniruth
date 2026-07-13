import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 });
    }

    const projects = await prisma.project.findMany({
      where: {
        clerkUserId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(projects);
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
