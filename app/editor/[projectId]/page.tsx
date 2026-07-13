import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

import { EditorWorkspace } from "@/components/editor/editor-workspace";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { projectId } = await params;

  if (!isDatabaseConfigured()) {
    return (
      <EditorWorkspace
        initialProjects={[]}
        projectPersistenceDisabledReason="Project storage is not configured. Add DATABASE_URL and run the Prisma migration to create projects."
        project={{
          id: projectId,
          name: "Untitled Workspace",
          description: null,
          status: "DRAFT",
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
      />
    );
  }

  // Fetch all user's projects to populate the sidebar list
  const projects = await prisma.project.findMany({
    where: { clerkUserId: userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true },
  });

  // Fetch specific active project details
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      clerkUserId: userId,
    },
  });

  if (!project) {
    redirect("/editor");
  }

  // Map database dates to ISO/serializable formats or date objects
  const serializedProject = {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };

  return (
    <EditorWorkspace
      initialProjects={projects}
      project={serializedProject}
    />
  );
}
