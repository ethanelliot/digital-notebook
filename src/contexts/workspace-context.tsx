import {
  useWorkspaceData,
  type UseWorkspaceDataResult,
} from '@/hooks/use-workspace-data'
import { createContext, use, type ReactNode } from 'react'

const WorkspaceContext = createContext<UseWorkspaceDataResult | undefined>(
  undefined
)

interface WorkspaceProviderProps {
  children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const workspaceData = useWorkspaceData()

  return (
    <WorkspaceContext.Provider value={workspaceData}>
      {children}
    </WorkspaceContext.Provider>
  )
}

// Custom hook to use the context
export function useWorkspaceContext() {
  const context = use(WorkspaceContext)
  if (context === undefined) {
    throw new Error(
      'useWorkspaceContext must be used within a WorkspaceProvider'
    )
  }
  return context
}
