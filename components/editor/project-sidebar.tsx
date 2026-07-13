"use client";

import type { ReactNode } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectDialogProject } from "@/components/editor/use-project-dialogs";
import { cn } from "@/lib/utils";

type ProjectSidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
  projects?: ProjectDialogProject[];
  sharedProjects?: ProjectDialogProject[];
  onCreateProject?: () => void;
  onRenameProject?: (project: ProjectDialogProject) => void;
  onDeleteProject?: (project: ProjectDialogProject) => void;
  projectPersistenceDisabledReason?: string;
  title?: ReactNode;
  description?: ReactNode;
  footerActions?: ReactNode;
  className?: string;
};

function EmptyProjectState({ label }: { label: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function ProjectList({
  emptyLabel,
  onDeleteProject,
  onRenameProject,
  projects,
}: {
  emptyLabel: string;
  onDeleteProject?: (project: ProjectDialogProject) => void;
  onRenameProject?: (project: ProjectDialogProject) => void;
  projects: ProjectDialogProject[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeProjectId = pathname.split("/editor/")[1] || null;

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
                : "border-border/70 bg-muted/20 hover:bg-muted/30"
            )}
          >
            <button
              type="button"
              className="min-w-0 flex-1 text-left cursor-pointer"
              aria-label={`Open ${project.name}`}
              onClick={() => router.push(`/editor/${project.id}`)}
            >
              <span className="block truncate text-sm font-medium">
                {project.name}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {project.id}
              </span>
            </button>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Rename ${project.name}`}
              onClick={() => onRenameProject?.(project)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Delete ${project.name}`}
              onClick={() => onDeleteProject?.(project)}
            >
              <Trash2 className="size-4" />
            </Button>
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
  title = "Projects",
  description,
  footerActions,
  className,
}: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "fixed left-3 top-17 bottom-3 z-40 flex w-[min(22rem,calc(100vw-1.5rem))] flex-col rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl shadow-background/40 transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]",
        className,
      )}
    >
      <div className="flex items-start gap-3 border-b border-border p-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-heading text-base font-medium leading-none">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Close project sidebar"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>

      <Tabs defaultValue="my-projects" className="min-h-0 flex-1 gap-0">
        <div className="border-b border-border px-4 py-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="p-4">
            <TabsContent value="my-projects" className="m-0">
              <ProjectList
                emptyLabel="No projects yet."
                projects={projects}
                onRenameProject={onRenameProject}
                onDeleteProject={onDeleteProject}
              />
            </TabsContent>
            <TabsContent value="shared" className="m-0">
              <ProjectList
                emptyLabel="No shared projects yet."
                projects={sharedProjects}
                onRenameProject={onRenameProject}
                onDeleteProject={onDeleteProject}
              />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      <div className="space-y-3 border-t border-border p-4">
        {footerActions ? (
          <div className="flex justify-end gap-2">{footerActions}</div>
        ) : null}
        {projectPersistenceDisabledReason ? (
          <p className="text-sm text-muted-foreground">
            {projectPersistenceDisabledReason}
          </p>
        ) : null}
        <Button
          type="button"
          className="w-full"
          onClick={onCreateProject}
          disabled={Boolean(projectPersistenceDisabledReason)}
        >
          <Plus className="size-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
