// src/hooks/useNotebook.ts

import { db } from "@/firebase";
import { NotFoundError, ServerError } from "@/lib/errors";
import type { Notebook } from "@/types/notebook";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  DocumentReference,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

interface UseNotebookResult {
  notebook: Notebook | null;
  loading: boolean;
  error: Error | null;
  saveNotebook: (newData: Partial<Notebook>) => Promise<void>;
}

export function useNotebook(notebookId: string): UseNotebookResult {
  const [notebookRef, setNotebookRef] = useState<DocumentReference | null>(
    null
  );
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!notebookId) {
      setNotebook(null);
      setLoading(false);
      setError(null);
      console.log("No notebook or Group ID provided.");
      return;
    }

    setLoading(true);
    setError(null);

    const fetchNotebookData = async () => {
      try {
        console.log(notebookId);
        const notebookDocRef = doc(db, "notebooks", notebookId);

        const notebookSnap = await getDoc(notebookDocRef);

        if (!notebookSnap.exists()) {
          throw new NotFoundError("Notebook not found.");
        }

        setNotebookRef(notebookDocRef);
        setNotebook(notebookSnap.data() as Notebook);

        console.log("Notebook data loaded:", notebookSnap.data());
      } catch (error) {
        console.error("Error fetching notebook:", error);
        setError(error as ServerError);
        setNotebook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotebookData();
  }, [notebookId]);

  const saveNotebook = useCallback(
    async (newData: Partial<Notebook>) => {
      if (!notebookId) {
        console.error("Cannot save: No notebook or group ID provided");
        setError(new Error("Cannot save: No notebook ID provided."));
        return;
      }

      setError(null);

      try {
        setNotebook(
          (prev) =>
            ({
              ...(prev || {}),
              ...newData,
              updatedAt: Timestamp.now(),
            } as Notebook)
        );

        if (!notebookRef) {
          throw new Error("Cannot save: Notebook reference is not set.");
        }

        await updateDoc(notebookRef, {
          ...newData,
        });

        console.log("Notebook saved successfully!");
      } catch (error) {
        console.error("Error saving notebook:", error);
        setError(error as Error);
      }
    },
    [notebookId, notebookRef]
  );

  return { notebook, loading, error, saveNotebook };
}
