"use client"

import { useState, type ReactNode } from "react"
import { UserButton } from "@clerk/nextjs"
import { Share2, X, Sparkles, ChevronDown, Info } from "lucide-react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ActiveProjectProvider } from "@/components/editor/active-project-context"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import type { ProjectDialogProject } from "@/components/editor/use-project-dialogs"
import { Button } from "@/components/ui/button"
import { clerkAppearance } from "@/lib/clerk/appearance"
import { cn } from "@/lib/utils"

type EditorLayoutProps = {
  children: ReactNode
  projects?: ProjectDialogProject[]
  onCreateProject?: () => void
  onRenameProject?: (project: ProjectDialogProject) => void
  onDeleteProject?: (project: ProjectDialogProject) => void
  projectPersistenceDisabledReason?: string
  sharedProjects?: ProjectDialogProject[]
  workspace?: {
    projectId: string
    projectName: string
  }
  className?: string
}

export function EditorLayout({
  children,
  projects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  projectPersistenceDisabledReason,
  sharedProjects,
  workspace,
  className,
}: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  return (
    <ActiveProjectProvider>
      <div
        className={cn(
          "flex min-h-dvh flex-col overflow-hidden bg-background text-foreground",
          className
        )}
      >
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          showSidebarToggle={true}
          onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
          left={
            <span className="truncate text-sm font-semibold text-zinc-200">
              {workspace?.projectName || "Liveblocks Live Room"}
            </span>
          }
          center={
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800 text-sm font-medium bg-zinc-900/50 text-zinc-200 select-none">
              <span>Workspace</span>
              <ChevronDown className="size-4 text-zinc-400" />
            </div>
          }
          right={
            <div className="flex items-center gap-3">
              {workspace ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 border-zinc-800 hover:bg-zinc-900 text-zinc-200 cursor-pointer h-9 px-3"
                    onClick={() => setIsShareDialogOpen(true)}
                  >
                    <Share2 className="size-4" />
                    Share
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
                    aria-pressed={isAiSidebarOpen}
                    className="gap-2 border-zinc-800 hover:bg-zinc-900 text-zinc-200 cursor-pointer h-9 px-3"
                    onClick={() => setIsAiSidebarOpen((current) => !current)}
                  >
                    <Sparkles className="size-4 text-purple-400" />
                    AI
                  </Button>
                </>
              ) : null}
              <UserButton appearance={clerkAppearance} />
            </div>
          }
        />

        {/* Main nested layout area sitting below navbar */}
        <div className="flex h-[calc(100dvh-3.5rem)] w-full relative">
          <ProjectSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            projects={projects}
            sharedProjects={sharedProjects}
            onCreateProject={onCreateProject}
            onRenameProject={onRenameProject}
            onDeleteProject={onDeleteProject}
            projectPersistenceDisabledReason={projectPersistenceDisabledReason}
            isWorkspace={!!workspace}
          />

          {isSidebarOpen ? (
            <button
              type="button"
              aria-label="Close project sidebar"
              className="fixed inset-x-0 top-14 bottom-0 z-30 bg-background/20 backdrop-blur-xs md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          ) : null}

          {workspace ? (
            <main className="min-w-0 flex-1 overflow-hidden relative h-full w-full">{children}</main>
          ) : (
            <main className="min-h-0 flex-1 overflow-auto">{children}</main>
          )}

          {workspace ? (
            <aside
              className={cn(
                "fixed right-3 top-17 bottom-3 z-40 w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border border-zinc-800 bg-zinc-950/85 text-zinc-100 p-5 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-in-out flex flex-col gap-4",
                isAiSidebarOpen ? "translate-x-0" : "translate-x-[calc(100%+2.5rem)]"
              )}
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-semibold text-zinc-200">AI Copilot</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-zinc-500 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-full select-none">
                    <Info className="size-3 text-zinc-500" />
                    <span>Placeholder panel</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close AI sidebar"
                    onClick={() => setIsAiSidebarOpen(false)}
                    className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 text-sm text-zinc-400 py-2">
                Chat surface pending...
              </div>

              <div className="border border-dashed border-zinc-800 bg-zinc-900/20 rounded-xl p-4 flex flex-col gap-1.5 mt-auto">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Future Hooks</span>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  This panel will hook into active node selection context, system instructions, and realtime changes.
                </p>
              </div>
            </aside>
          ) : null}
        </div>

        {workspace ? (
          <ShareDialog
            projectId={workspace.projectId}
            open={isShareDialogOpen}
            onOpenChange={setIsShareDialogOpen}
          />
        ) : null}
      </div>
    </ActiveProjectProvider>
  )
}
