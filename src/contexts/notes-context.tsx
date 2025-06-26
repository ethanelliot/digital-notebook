import { useNotes } from "@/hooks/use-notes";
import type { Note } from "@/types/Note";
import { createContext, useContext, type ReactNode } from "react";

type AddNoteInput = Omit<Note, "id" | "createdAt" | "updatedAt">;
type UpdateNoteInput = {
  newData: Partial<Omit<Note, "id" | "createdAt">>;
  id: string;
};
interface NotesContextType {
  notes: Note[] | null;
  loading: boolean;
  error: Error | null;
  addNote: (note: AddNoteInput) => Promise<void>;
  updateNote: (note: UpdateNoteInput) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

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
