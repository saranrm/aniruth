"use client";

import { useProjectActions } from "@/hooks/use-project-actions";
import { EditorLayout } from "@/components/editor/editor-layout";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import type { ProjectDialogProject } from "@/components/editor/use-project-dialogs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, Settings, Trash2, Pencil, RefreshCw, ZoomIn, ZoomOut, Move } from "lucide-react";

type ProjectType = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: any;
  updatedAt: any;
};

type EditorWorkspaceProps = {
  projectPersistenceDisabledReason?: string;
  initialProjects?: ProjectDialogProject[];
  project: ProjectType;
};

export function EditorWorkspace({
  projectPersistenceDisabledReason,
  initialProjects = [],
  project,
}: EditorWorkspaceProps) {
  const dialogs = useProjectActions();
  const isProjectPersistenceDisabled = Boolean(
    projectPersistenceDisabledReason
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
      <div className="flex h-full flex-col p-6 space-y-6">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs shadow-sm gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {project.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {project.status}
              </span>
            </div>
            {project.description ? (
              <p className="text-sm text-muted-foreground">{project.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No description provided.</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dialogs.openRenameDialog(project)}
              disabled={isProjectPersistenceDisabled}
            >
              <Pencil className="size-4 mr-2" />
              Rename
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => dialogs.openDeleteDialog(project)}
              disabled={isProjectPersistenceDisabled}
            >
              <Trash2 className="size-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Workspace Canvas / Grid */}
        <div className="flex-1 min-h-[400px] border border-border/70 bg-muted/10 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-sm">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="flex flex-col items-center space-y-4 max-w-md text-center z-10">
            <div className="p-4 rounded-full border border-dashed border-muted-foreground/30 bg-background/50 shadow-inner">
              <Move className="size-8 text-neutral-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-foreground">Interactive Infinite Canvas</h2>
              <p className="text-sm text-muted-foreground">
                Start drawing blocks and architecture flow diagrams. Canvas changes are saved to the database.
              </p>
            </div>
          </div>

          {/* Simple Canvas Toolbar mockup */}
          <div className="absolute bottom-4 left-4 flex gap-1 bg-background/90 border border-border p-1 rounded-xl shadow-lg z-10">
            <Button variant="ghost" size="icon" className="size-8"><ZoomIn className="size-4" /></Button>
            <Button variant="ghost" size="icon" className="size-8"><ZoomOut className="size-4" /></Button>
            <div className="w-[1px] bg-border my-1 mx-1" />
            <Button variant="ghost" size="icon" className="size-8"><RefreshCw className="size-4" /></Button>
          </div>
        </div>

        {/* Project Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card/70 border-border/75 shadow-sm">
            <CardHeader className="py-4">
              <span className="text-sm font-medium flex items-center gap-2 text-foreground">
                <CalendarDays className="size-4 text-muted-foreground" />
                Project Details
              </span>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span>Created At</span>
                <span className="font-semibold text-foreground">
                  {new Date(project.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Last Updated</span>
                <span className="font-semibold text-foreground">
                  {new Date(project.updatedAt).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70 border-border/75 shadow-sm">
            <CardHeader className="py-4">
              <span className="text-sm font-medium flex items-center gap-2 text-foreground">
                <Settings className="size-4 text-muted-foreground" />
                Workspace Settings
              </span>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span>Room ID</span>
                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground text-[10px]">
                  {project.id}
                </span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Access Control</span>
                <span className="font-semibold text-foreground">Private (Owner Only)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProjectDialogs controller={dialogs} />
    </EditorLayout>
  );
}
