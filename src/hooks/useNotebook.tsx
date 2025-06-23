// src/hooks/useNotebook.ts

import { db } from "@/firebase";
import type { NotebookData } from "@/types/notebook";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

interface UseNotebookResult {
  notebook: NotebookData | null;
  loading: boolean;
  error: Error | null;
  saveNotebook: (newData: Partial<NotebookData>) => Promise<void>;
}

export function useNotebook(id: string | undefined): UseNotebookResult {
  const [notebook, setNotebook] = useState<NotebookData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setNotebook(null);
      setLoading(false);
      setError(null);
      console.log("No notebook ID provided. Ready for new notebook creation.");
      return;
    }

    setLoading(true);
    setError(null);

    const fetchNotebookData = async () => {
      try {
        const notebookDocRef = doc(db, "notebooks", id);
        const docSnap = await getDoc(notebookDocRef);

        if (docSnap.exists()) {
          setNotebook(docSnap.data() as NotebookData);
          console.log("Notebook data loaded:", docSnap.data());
        } else {
          setError(new Error(`Notebook with ID "${id}" not found.`));
          setNotebook(null);
        }
      } catch (error) {
        console.error("Error fetching notebook:", error);
        setError(error as Error);
        setNotebook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotebookData();
  }, [id]);

  const saveNotebook = useCallback(
    async (newData: Partial<NotebookData>) => {
      if (!id) {
        console.error(
          "Cannot save: No notebook ID provided. Use createNotebook for new ones."
        );
        setError(new Error("Cannot save: No notebook ID provided."));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const notebookDocRef = doc(db, "notebooks", id);

        setNotebook(
          (prev) =>
            ({
              ...(prev || {}),
              ...newData,
              updatedAt: Timestamp.now(),
            } as NotebookData)
        );

        await updateDoc(notebookDocRef, {
          ...newData,
        });

        console.log("Notebook saved successfully!");
      } catch (error) {
        console.error("Error saving notebook:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  return { notebook, loading, error, saveNotebook };
}
