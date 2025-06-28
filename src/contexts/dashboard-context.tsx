import {
  useDashboardData,
  type UseDashboardDatasResult,
} from "@/hooks/use-dashboard-data";
import { createContext, useContext, type ReactNode } from "react";

const DashbaordContext = createContext<UseDashboardDatasResult | undefined>(
  undefined
);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashbaordProvider({ children }: DashboardProviderProps) {
  // Move your useNotes hook logic here
  const notesData = useDashboardData(); // Your existing hook

  return (
    <DashbaordContext.Provider value={notesData}>
      {children}
    </DashbaordContext.Provider>
  );
}

// Custom hook to use the context
export function useDashboardContext() {
  const context = useContext(DashbaordContext);
  if (context === undefined) {
    throw new Error("useDashboardContext must be used within a NotesProvider");
  }
  return context;
}
