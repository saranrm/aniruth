"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

const ACTIVE_PROJECT_STORAGE_KEY = "editor-active-project-id"

type ActiveProjectContextValue = {
  activeProjectId: string | null
  isProjectLoading: boolean
  projectSelectionError: string | null
  selectProject: (projectId: string) => Promise<void>
}

const ActiveProjectContext = createContext<ActiveProjectContextValue | null>(null)

function getProjectIdFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/editor\/([^/]+)$/)
  return match?.[1] ?? null
}

export function ActiveProjectProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const routeProjectId = getProjectIdFromPathname(pathname)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(routeProjectId)
  const [isProjectLoading, setIsProjectLoading] = useState(false)
  const [projectSelectionError, setProjectSelectionError] = useState<string | null>(null)

  useEffect(() => {
    if (!routeProjectId) {
      return
    }

    setActiveProjectId(routeProjectId)
    setIsProjectLoading(false)
    setProjectSelectionError(null)
    window.localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, routeProjectId)
  }, [routeProjectId])

  const selectProject = useCallback(async (projectId: string) => {
    setActiveProjectId(projectId)
    setIsProjectLoading(true)
    setProjectSelectionError(null)
    window.localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, projectId)

    try {
      const response = await fetch(`/api/projects/${projectId}`, { cache: "no-store" })

      if (!response.ok) {
        throw new Error(await response.text() || "Unable to load this project")
      }

      router.push(`/editor/${projectId}`)
    } catch (error) {
      setProjectSelectionError(error instanceof Error ? error.message : "Unable to load this project")
      setActiveProjectId(routeProjectId)
      if (routeProjectId) {
        window.localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, routeProjectId)
      } else {
        window.localStorage.removeItem(ACTIVE_PROJECT_STORAGE_KEY)
      }
    } finally {
      setIsProjectLoading(false)
    }
  }, [routeProjectId, router])

  const value = useMemo(() => ({
    activeProjectId,
    isProjectLoading,
    projectSelectionError,
    selectProject,
  }), [activeProjectId, isProjectLoading, projectSelectionError, selectProject])

  return <ActiveProjectContext.Provider value={value}>{children}</ActiveProjectContext.Provider>
}

export function useActiveProject() {
  const context = useContext(ActiveProjectContext)

  if (!context) {
    throw new Error("useActiveProject must be used within ActiveProjectProvider")
  }

  return context
}

export function persistActiveProjectId(projectId: string | null) {
  if (typeof window === "undefined") {
    return
  }

  if (projectId) {
    window.localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, projectId)
  } else {
    window.localStorage.removeItem(ACTIVE_PROJECT_STORAGE_KEY)
  }
}
