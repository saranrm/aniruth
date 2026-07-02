"use client"

import { useState, type ReactNode } from "react"
import { UserButton } from "@clerk/nextjs"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import type { ProjectDialogProject } from "@/components/editor/use-project-dialogs"
import { clerkAppearance } from "@/lib/clerk/appearance"
import { cn } from "@/lib/utils"

type EditorLayoutProps = {
  children: ReactNode
  projects?: ProjectDialogProject[]
  onCreateProject?: () => void
  onRenameProject?: (project: ProjectDialogProject) => void
  onDeleteProject?: (project: ProjectDialogProject) => void
  className?: string
}

export function EditorLayout({
  children,
  projects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  className,
}: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col overflow-hidden bg-background text-foreground",
        className
      )}
    >
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        right={<UserButton appearance={clerkAppearance} />}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projects}
        onCreateProject={onCreateProject}
        onRenameProject={onRenameProject}
        onDeleteProject={onDeleteProject}
      />

      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close project sidebar"
          className="fixed inset-x-0 top-14 bottom-0 z-30 bg-background/70 backdrop-blur-xs md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <main className="min-h-0 flex-1 overflow-auto">{children}</main>
    </div>
  )
}
