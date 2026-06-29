import type { ReactNode } from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EditorNavbarProps = {
  isSidebarOpen: boolean
  onToggleSidebar?: () => void
  center?: ReactNode
  right?: ReactNode
  className?: string
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  center,
  right,
  className,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center border-b border-border bg-background/95 px-3 text-foreground",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center justify-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-pressed={isSidebarOpen}
          onClick={onToggleSidebar}
        >
          <SidebarIcon className="size-5" />
        </Button>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center">
        {center}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end">
        {right}
      </div>
    </header>
  )
}
