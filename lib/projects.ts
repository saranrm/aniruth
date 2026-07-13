import type { ProjectDialogProject } from "@/components/editor/use-project-dialogs";

/**
 * Generates a unique room ID aligned with a short unique suffix.
 */
export function generateRoomId(slug: string): string {
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${slug}-${suffix}`;
}

async function getErrorMessage(res: Response, fallback: string) {
  const message = await res.text();
  return message || fallback;
}

/**
 * Fetches the user's projects from the API.
 * Used for client-side lists if required.
 */
export async function getProjects(): Promise<ProjectDialogProject[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to fetch projects"));
  }
  return res.json();
}

/**
 * POST wrapper to create a new project.
 */
export async function createProjectRecord(id: string, name: string) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name }),
  });
  
  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to create project"));
  }

  return res.json();
}

/**
 * PUT wrapper to rename an existing project.
 */
export async function renameProjectRecord(projectId: string, name: string) {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to rename project"));
  }

  return res.json();
}

/**
 * DELETE wrapper to remove an existing project.
 */
export async function deleteProjectRecord(projectId: string) {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to delete project"));
  }

  return res.json();
}
