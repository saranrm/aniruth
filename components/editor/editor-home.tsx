"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EditorLayout } from "@/components/editor/editor-layout";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import type { ProjectDialogProject } from "@/components/editor/use-project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";

type EditorHomeProps = {
  projectPersistenceDisabledReason?: string;
  initialProjects?: ProjectDialogProject[];
};

export function EditorHome({
  projectPersistenceDisabledReason,
  initialProjects = [],
}: EditorHomeProps) {
  const dialogs = useProjectActions();
  const isProjectPersistenceDisabled = Boolean(
    projectPersistenceDisabledReason,
  );

  return (
    <EditorLayout
      projects={initialProjects}
      onCreateProject={
        isProjectPersistenceDisabled ? undefined : dialogs.openCreateDialog
      }
      onRenameProject={
        isProjectPersistenceDisabled ? undefined : dialogs.openRenameDialog
      }
      onDeleteProject={
        isProjectPersistenceDisabled ? undefined : dialogs.openDeleteDialog
      }
      projectPersistenceDisabledReason={projectPersistenceDisabledReason}
    >
      <div className="flex min-h-full items-center justify-center px-6 py-12 sm:px-8 lg:px-10">
        <div className="flex w-full max-w-xl flex-col items-center gap-5 rounded-2xl border border-border/70 bg-card/70 p-8 text-center shadow-sm backdrop-blur-sm sm:p-10">
          <div className="flex size-12 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
            <Plus className="size-5" />
          </div>
          <div className="space-y-3">
            <h1 className="font-heading text-2xl font-medium tracking-normal text-foreground sm:text-3xl">
              Create a project or open an existing one
            </h1>
            <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
              {projectPersistenceDisabledReason ??
                "Start a new architecture workspace, or choose a project from the sidebar."}
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={dialogs.openCreateDialog}
            disabled={isProjectPersistenceDisabled}
          >
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
      </div>

      <ProjectDialogs controller={dialogs} />
    </EditorLayout>
  );
}
