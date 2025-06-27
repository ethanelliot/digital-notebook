import { useNotes, type UseNotesResult } from "@/hooks/use-notes";
import { createContext, useContext, type ReactNode } from "react";

const NotesContext = createContext<UseNotesResult | undefined>(undefined);

interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  // Move your useNotes hook logic here
  const notesData = useNotes(); // Your existing hook

  return (
    <NotesContext.Provider value={notesData}>{children}</NotesContext.Provider>
  );
}

// Custom hook to use the context
export function useNotesContext() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotesContext must be used within a NotesProvider");
  }
  return context;
}
