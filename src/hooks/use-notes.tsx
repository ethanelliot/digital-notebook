import { db } from "@/firebase";
import { ServerError } from "@/lib/errors";
import type { Note } from "@/types/Note";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

type AddNoteInput = Omit<Note, "id" | "createdAt" | "updatedAt">;
type UpdateNoteInput = Partial<Omit<Note, "id" | "createdAt">> & { id: string };

interface UseNotesResult {
  notes: Note[] | null;
  loading: boolean;
  error: Error | null;
  addNote: (note: AddNoteInput) => Promise<void>;
  updateNote: (note: UpdateNoteInput) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export function useNotes(): UseNotesResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [notes, setNotes] = useState<Note[] | null>(null);

  useEffect(() => {
    const q = query(collection(db, "notes"));

    // Set up Firebase listener here
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Success callback
        const newNotes = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Note)
        );
        setNotes(newNotes);
        console.log(newNotes);
        setLoading(false);
      },
      (error) => {
        // Error callback
        setError(new ServerError(error.message));
        setLoading(false);
      }
    );

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const addNote = useCallback(async () => {}, []);
  const updateNote = useCallback(async () => {}, []);
  const deleteNote = useCallback(async () => {}, []);

  return { notes, loading, error, addNote, updateNote, deleteNote };
}
