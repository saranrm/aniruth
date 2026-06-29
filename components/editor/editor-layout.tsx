"use client"

import { useState, type ReactNode } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { cn } from "@/lib/utils"

type EditorLayoutProps = {
  children: ReactNode
  className?: string
}

export function EditorLayout({ children, className }: EditorLayoutProps) {
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
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="min-h-0 flex-1 overflow-auto">{children}</main>
    </div>
  )
}
