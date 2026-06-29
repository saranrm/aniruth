"use client"

import type { ReactNode } from "react"
import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type ProjectSidebarProps = {
  isOpen: boolean
  onClose?: () => void
  title?: ReactNode
  description?: ReactNode
  footerActions?: ReactNode
  className?: string
}

function EmptyProjectState({ label }: { label: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
      {label}
    </div>
  )
}

export function ProjectSidebar({
  isOpen,
  onClose,
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
        className
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
              <EmptyProjectState label="No projects yet." />
            </TabsContent>
            <TabsContent value="shared" className="m-0">
              <EmptyProjectState label="No shared projects yet." />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      <div className="space-y-3 border-t border-border p-4">
        {footerActions ? <div className="flex justify-end gap-2">{footerActions}</div> : null}
        <Button type="button" className="w-full">
          <Plus className="size-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
