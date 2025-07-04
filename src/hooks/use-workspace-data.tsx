import { db } from "@/firebase";
import { MAX_VISIBLE_GROUPS } from "@/lib/constants";
import { ServerError } from "@/lib/errors";
import type { Group } from "@/types/group";
import type { Note } from "@/types/note";
import type { Notebook } from "@/types/notebook";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";

type AddNoteInput = Omit<
  Note,
  "id" | "createdAt" | "updatedAt" | "groupName" | "groupColor" | "groupRef"
>;
type UpdateNoteInput = {
  note: Note;
  newData: Partial<
    Omit<
      Note,
      "id" | "createdAt" | "updatedAt" | "groupName" | "groupColor" | "groupRef"
    >
  >;
};
type DeleteNoteInput = {
  noteId: string;
};

type AddGroupInput = Omit<Group, "id" | "createdAt" | "updatedAt">;
type UpdateGroupInput = {
  group: Group;
  newData: Partial<Omit<Group, "id" | "createdAt">>;
};
type DeleteGroupInput = {
  groupId: string;
};

type AddNotebookInput = Omit<
  Notebook,
  "id" | "createdAt" | "updatedAt" | "groupName" | "groupRef"
>;
type UpdateNotebookInput = {
  notebook: Notebook;
  newData: Partial<
    Omit<Notebook, "id" | "createdAt" | "updatedAt" | "groupName" | "groupRef">
  >;
};
type DeleteNotebookInput = {
  notebookId: string;
};

export interface UseWorkspaceDataResult {
  groups: Group[];
  notes: Note[];
  notebooks: Notebook[];
  loading: boolean;
  error: Error | null;
  addNote: (note: AddNoteInput) => Promise<void>;
  updateNote: (note: UpdateNoteInput) => Promise<void>;
  deleteNote: (note: DeleteNoteInput) => Promise<void>;
  addGroup: (group: AddGroupInput) => Promise<void>;
  updateGroup: (group: UpdateGroupInput) => Promise<void>;
  deleteGroup: (group: DeleteGroupInput) => Promise<void>;
  addNotebook: (notebook: AddNotebookInput) => Promise<void>;
  updateNotebook: (notebook: UpdateNotebookInput) => Promise<void>;
  deleteNotebook: (notebook: DeleteNotebookInput) => Promise<void>;
}

export function useWorkspaceData(): UseWorkspaceDataResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const groupsRef = useMemo(() => collection(db, "groups"), []);
  const notesRef = useMemo(() => collection(db, "notes"), []);
  const notebooksRef = useMemo(() => collection(db, "notebooks"), []);

  useEffect(() => {
    const q = query(groupsRef); // adjust for visability

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newGroups = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Group)
        );
        setGroups(newGroups);
        setLoading(false);
      },
      (error) => {
        setError(new ServerError(error.message));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [groupsRef]);

  const visibleGroups = useMemo(
    () =>
      groups.filter((group) => !group.isHidden).slice(0, MAX_VISIBLE_GROUPS),
    [groups]
  );

  useEffect(() => {
    if (visibleGroups.length === 0) {
      setNotes([]);
      setNotebooks([]);
      return;
    }

    const groupRefs = visibleGroups.map((group) => doc(db, "groups", group.id));

    const notesQuery = query(notesRef, where("groupRef", "in", groupRefs));

    const notesUnsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const allNotes = snapshot.docs.map((doc) => {
        const noteData = doc.data();

        const group = visibleGroups.find(
          (group) => group.id === noteData.groupRef.id
        );

        return {
          id: doc.id,
          ...noteData,
          groupColor: group?.color,
          groupName: group?.name,
          groupId: group?.id,
        } as Note;
      });
      setNotes(allNotes);
    });

    const notebookQuery = query(
      notebooksRef,
      where("groupRef", "in", groupRefs)
    );

    const notebooksUnsubscribe = onSnapshot(notebookQuery, (snapshot) => {
      const allNotebooks = snapshot.docs.map((doc) => {
        const noteData = doc.data();

        const group = visibleGroups.find(
          (group) => group.id === noteData.groupRef.id
        );

        return {
          id: doc.id,
          ...noteData,
          groupId: group?.id,
          groupName: group?.name,
          groupColor: group?.color,
        } as Notebook;
      });
      setNotebooks(allNotebooks);
    });
    return () => {
      notesUnsubscribe();
      notebooksUnsubscribe();
    };
  }, [visibleGroups, notesRef, notebooksRef]);

  const addNote = useCallback(
    async (data: AddNoteInput) => {
      try {
        const groupRef = doc(groupsRef, data.groupId);

        await addDoc(notesRef, {
          content: data.content,
          status: data.status,
          dueDate: data.dueDate,
          groupRef: groupRef,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        setError(error as ServerError);
        console.log(error);
      }
    },
    [groupsRef, notesRef]
  );

  const updateNote = useCallback(
    async ({ note, newData }: UpdateNoteInput) => {
      if (!note) {
        console.error("Cannot save: No note ID provided");
        setError(new Error("Cannot save: No notebook ID provided."));
        return;
      }

      try {
        const { groupId: newGroupId, ...newNoteDataWithoutGroupId } = newData;
        const noteRef = doc(notesRef, note.id);

        // if the note is in a new group
        let groupRef;
        if (newGroupId && newGroupId !== note.groupId) {
          groupRef = doc(groupsRef, newGroupId);
        } else {
          groupRef = note.groupRef;
        }

        await updateDoc(noteRef, {
          ...newNoteDataWithoutGroupId,
          groupRef: groupRef,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        setError(error as Error);
      }
    },
    [groupsRef, notesRef]
  );

  const deleteNote = useCallback(
    async ({ noteId }: DeleteNoteInput) => {
      if (!noteId) {
        console.error("Cannot delete: No note or group ID provided");
        setError(new Error("Cannot save: No notebook ID provided."));
        return;
      }
      setError(null);
      try {
        const noteRef = doc(notesRef, noteId);
        await deleteDoc(noteRef);
      } catch (error) {
        setError(error as ServerError);
      }
    },
    [notesRef]
  );

  const addGroup = useCallback(
    async (data: AddGroupInput) => {
      try {
        await addDoc(groupsRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        setError(error as ServerError);
        console.log(error);
      }
    },
    [groupsRef]
  );

  const updateGroup = useCallback(
    async ({ group, newData }: UpdateGroupInput) => {
      try {
        //   if (Object.keys(newData).length > 0)
        const groupRef = doc(groupsRef, group.id);
        await updateDoc(groupRef, {
          ...newData,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        setError(error as ServerError);
      }
    },
    [groupsRef]
  );

  const deleteGroup = useCallback(
    async ({ groupId }: DeleteGroupInput) => {
      if (!groupId) {
        console.error("Cannot delete: No group ID provided");
        setError(new Error("Cannot save: No notebook ID provided."));
        return;
      }
      try {
        // need a batch query here as we must delete notes and notebooks of group safely (all at once)
        const batch = writeBatch(db);

        const groupRef = doc(groupsRef, groupId);

        const notesQuery = await getDocs(
          query(notesRef, where("groupRef", "==", groupRef))
        );

        notesQuery.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        const notebookQuery = await getDocs(
          query(notebooksRef, where("groupRef", "==", groupRef))
        );

        notebookQuery.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        batch.delete(groupRef);

        batch.commit();
      } catch (error) {
        setError(error as ServerError);
      }
    },
    [groupsRef, notesRef, notebooksRef]
  );

  // TODO: Split notebook metadata from content for better performance
  // Move content to subcollection, create useNotebookContent(id) hook for lazy loading
  // Current approach loads unnecessary data (images, large docs) on dashboard

  const addNotebook = useCallback(
    async (data: AddNotebookInput) => {
      try {
        const groupRef = doc(groupsRef, data.groupId);

        const notebookRef = collection(notebooksRef, "notebooks");

        await addDoc(notebookRef, {
          ...data,
          groupRef: groupRef,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        setError(error as ServerError);
        console.log(error);
      }
    },
    [groupsRef, notebooksRef]
  );

  const updateNotebook = useCallback(
    async ({ notebook, newData }: UpdateNotebookInput) => {
      try {
        const { groupId: newGroupId, ...newNotebookDataWithoutGroupId } =
          newData;
        const notebookRef = doc(notebooksRef, notebook.id);

        console.log(newGroupId);
        let groupRef;
        if (newGroupId && newGroupId !== notebook.groupId) {
          groupRef = doc(groupsRef, newGroupId);
        } else {
          groupRef = notebook.groupRef;
        }

        await updateDoc(notebookRef, {
          ...newNotebookDataWithoutGroupId,
          groupRef: groupRef,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        setError(error as ServerError);
      }
    },
    [groupsRef, notebooksRef]
  );

  const deleteNotebook = useCallback(
    async ({ notebookId }: DeleteNotebookInput) => {
      if (!notebookId) {
        console.error("Cannot delete: No group or notebook ID provided");
        setError(new Error("Cannot save: No notebook ID provided."));
        return;
      }
      try {
        const batch = writeBatch(db);

        const notebookRef = doc(notebooksRef, notebookId);
        const notebookContentRef = doc(notebookRef, "content", "main");

        batch.delete(notebookContentRef);
        batch.delete(notebookRef);

        await batch.commit();
      } catch (error) {
        setError(error as ServerError);
      }
    },
    [notebooksRef]
  );

  return {
    groups,
    notes,
    notebooks,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    addGroup,
    updateGroup,
    deleteGroup,
    addNotebook,
    updateNotebook,
    deleteNotebook,
  };
}
