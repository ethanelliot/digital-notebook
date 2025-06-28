import { db } from "@/firebase";
import { ServerError } from "@/lib/errors";
import type { Note } from "@/types/Note";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";

type AddNoteInput = Omit<Note, "id" | "createdAt" | "updatedAt">;
type UpdateNoteInput = {
  newData: Partial<Omit<Note, "id" | "createdAt">>;
  id: string;
};

export interface UseDashboardDatasResult {
  notes: Note[] | null;
  loading: boolean;
  error: Error | null;
  addNote: (note: AddNoteInput) => Promise<void>;
  updateNote: (note: UpdateNoteInput) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export function useDashboardData(): UseDashboardDatasResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const [notes, setNotes] = useState<Note[] | null>(null);

  const notesRef = useMemo(() => collection(db, "notes"), []);

  // use effect for groups and this is a dependency of the folling use effect

  useEffect(() => {
    const q = query(notesRef);

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
  }, [notesRef]);

  const addNote = useCallback(
    async (data: AddNoteInput) => {
      console.log(data);
      try {
        await addDoc(notesRef, {
          ...data,
        });
      } catch (error) {
        setError(error as ServerError);
        console.log(error);
      }
    },
    [notesRef]
  );

  const updateNote = useCallback(
    async ({ newData, id }: UpdateNoteInput) => {
      if (!id) {
        console.error("Cannot save: No note ID provided");
        setError(new Error("Cannot save: No notebook ID provided."));
        return;
      }

      setError(null);

      try {
        const noteDocRef = doc(notesRef, id);
        await updateDoc(noteDocRef, {
          ...newData,
        });
      } catch (error) {
        setError(error as ServerError);
      }
    },
    [notesRef]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      if (!id) {
        console.error("Cannot save: No note ID provided");
        setError(new Error("Cannot save: No notebook ID provided."));
        return;
      }
      setError(null);

      try {
        const noteDocRef = doc(notesRef, id);
        await deleteDoc(noteDocRef);
      } catch (error) {
        setError(error as ServerError);
      }
    },
    [notesRef]
  );

  return { notes, loading, error, addNote, updateNote, deleteNote };
}
