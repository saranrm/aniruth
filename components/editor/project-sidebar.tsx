"use client";

import { type ReactNode, useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectDialogProject } from "@/components/editor/use-project-dialogs";
import { cn } from "@/lib/utils";
import { useActiveProject } from "@/components/editor/active-project-context";

type ProjectSidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
  projects?: ProjectDialogProject[];
  sharedProjects?: ProjectDialogProject[];
  onCreateProject?: () => void;
  onRenameProject?: (project: ProjectDialogProject) => void;
  onDeleteProject?: (project: ProjectDialogProject) => void;
  projectPersistenceDisabledReason?: string;
  className?: string;
  isWorkspace?: boolean;
};

function EmptyProjectState({ label }: { label: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/10 p-6 text-center text-sm text-zinc-500">
      {label}
    </div>
  );
}

function ProjectList({
  emptyLabel,
  onDeleteProject,
  onRenameProject,
  projects,
  canManage = true,
}: {
  emptyLabel: string;
  onDeleteProject?: (project: ProjectDialogProject) => void;
  onRenameProject?: (project: ProjectDialogProject) => void;
  projects: ProjectDialogProject[];
  canManage?: boolean;
}) {
  const { activeProjectId, isProjectLoading, selectProject } = useActiveProject();

  if (projects.length === 0) {
    return <EmptyProjectState label={emptyLabel} />;
  }

  return (
    <div className="grid gap-2">
      {projects.map((project) => {
        const isActive = activeProjectId === project.id;
        return (
          <div
            key={project.id}
            className={cn(
              "flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 shadow-sm transition-colors",
              isActive
                ? "border-primary/50 bg-primary/5 text-primary"
                : "border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/50"
            )}
          >
            <button
              type="button"
              className="min-w-0 flex-1 text-left cursor-pointer"
              aria-label={`Open ${project.name}`}
              onClick={() => void selectProject(project.id)}
              aria-busy={isProjectLoading && activeProjectId === project.id}
            >
              <span className="block truncate text-sm font-medium text-zinc-200">
                {project.name}
              </span>
              <span className="block truncate text-xs text-zinc-500">
                {project.id}
              </span>
            </button>

            {canManage ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Rename ${project.name}`}
                  onClick={() => onRenameProject?.(project)}
                  className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${project.name}`}
                  onClick={() => onDeleteProject?.(project)}
                  className="text-zinc-500 hover:text-red-400 hover:bg-zinc-900"
                >
                  <Trash2 className="size-4" />
                </Button>
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects = [],
  sharedProjects = [],
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  projectPersistenceDisabledReason,
  className,
}: ProjectSidebarProps) {
  const { projectSelectionError } = useActiveProject();
  const [activeTab, setActiveTab] = useState("my-projects");
  const [localSharedProjects, setLocalSharedProjects] = useState<ProjectDialogProject[]>(sharedProjects);
  const [isSharedLoading, setIsSharedLoading] = useState(false);

  const fetchSharedProjects = useCallback(async () => {
    setIsSharedLoading(true);
    try {
      const res = await fetch("/api/projects/shared");
      if (res.ok) {
        const data = await res.json();
        setLocalSharedProjects(data);
      }
    } catch {
      // silently fail — initial prop data remains
    } finally {
      setIsSharedLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "shared") {
      void fetchSharedProjects();
    }
  }, [activeTab, fetchSharedProjects]);

  useEffect(() => {
    if (isOpen) {
      void fetchSharedProjects();
    }
  }, [isOpen, fetchSharedProjects]);

  useEffect(() => {
    const handler = () => void fetchSharedProjects();
    window.addEventListener("project-shared", handler);
    return () => window.removeEventListener("project-shared", handler);
  }, [fetchSharedProjects]);

  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "fixed left-3 top-17 bottom-3 z-40 w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border border-zinc-800 bg-zinc-950/85 text-zinc-100 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2.5rem)]",
        className,
      )}
    >
      <div className="flex items-start justify-between border-b border-zinc-850 p-4">
        <div>
          <h2 className="font-semibold text-lg text-zinc-200">
            Projects
          </h2>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Close project sidebar"
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
        >
          <X className="size-4" />
        </Button>
      </div>

      <Tabs 
        defaultValue="my-projects" 
        className="min-h-0 flex-1 flex flex-col" 
        onValueChange={setActiveTab}
      >
        <div className="border-b border-zinc-900 px-4 py-3">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="my-projects" className="cursor-pointer">My Projects</TabsTrigger>
            <TabsTrigger value="shared" className="cursor-pointer">Shared</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="p-4">
            <TabsContent value="my-projects" className="m-0 focus-visible:outline-none">
              <ProjectList
                emptyLabel="No projects yet."
                projects={projects}
                onRenameProject={onRenameProject}
                onDeleteProject={onDeleteProject}
              />
            </TabsContent>
            <TabsContent value="shared" className="m-0 focus-visible:outline-none">
              {isSharedLoading ? (
                <div className="flex min-h-48 items-center justify-center text-sm text-zinc-500">
                  Loading shared projects...
                </div>
              ) : (
                <ProjectList
                  emptyLabel="No shared projects yet."
                  projects={localSharedProjects}
                  canManage={false}
                />
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      {projectSelectionError ? <p role="alert" className="sr-only">{projectSelectionError}</p> : null}

      <div className="space-y-3 border-t border-zinc-900 p-4">
        {projectPersistenceDisabledReason ? (
          <p className="text-xs text-zinc-500">
            {projectPersistenceDisabledReason}
          </p>
        ) : null}
        <Button
          type="button"
          className="w-full cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium"
          onClick={onCreateProject}
          disabled={Boolean(projectPersistenceDisabledReason)}
        >
          <Plus className="size-4 mr-2" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
