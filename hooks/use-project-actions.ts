"use client";

import { usePathname, useRouter } from "next/navigation";
import { useProjectDialogs } from "@/components/editor/use-project-dialogs";
import {
  generateRoomId,
  createProjectRecord,
  renameProjectRecord,
  deleteProjectRecord,
} from "@/lib/projects";

export function useProjectActions() {
  const router = useRouter();
  const pathname = usePathname();

  const dialogs = useProjectDialogs({
    onCreateProject: async (name, slug) => {
      const roomId = generateRoomId(slug);
      
      const project = await createProjectRecord(roomId, name);
      router.push(`/editor/${project.id}`);
    },
    
    onRenameProject: async (project, name) => {
      await renameProjectRecord(project.id, name);
      router.refresh();
    },
    
    onDeleteProject: async (project) => {
      await deleteProjectRecord(project.id);
      
      if (pathname.includes(project.id)) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    },
  });

  return dialogs;
}
