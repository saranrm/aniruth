import type { ReactNode } from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EditorNavbarProps = {
  isSidebarOpen: boolean
  showSidebarToggle?: boolean
  onToggleSidebar?: () => void
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
  className?: string
}

export function EditorNavbar({
  isSidebarOpen,
  showSidebarToggle = true,
  onToggleSidebar,
  left,
  center,
  right,
  className,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-3 text-zinc-100",
        className
      )}
    >
      {/* Left Area */}
      <div className="flex min-w-0 flex-1 items-center justify-start gap-3">
        {showSidebarToggle ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-pressed={isSidebarOpen}
            onClick={onToggleSidebar}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          >
            <SidebarIcon className="size-5" />
          </Button>
        ) : null}
        {left}
      </div>

      {/* Center Area */}
      <div className="flex min-w-0 flex-1 items-center justify-center">
        {center}
      </div>

      {/* Right Area */}
      <div className="flex min-w-0 flex-1 items-center justify-end">
        {right}
      </div>
    </header>
  )
}
