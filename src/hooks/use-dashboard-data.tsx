import { db } from "@/firebase";
import { NotFoundError, ServerError } from "@/lib/errors";
import type { Group } from "@/types/group";
import type { Note } from "@/types/note";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type AddNoteInput = Omit<Note, "id" | "createdAt" | "updatedAt" | "groupName">;
type UpdateNoteInput = {
  note: Note;
  newData: Partial<Omit<Note, "id" | "createdAt" | "groupName">>;
};
type deleteNoteInput = {
  groupId: string;
  noteId: string;
};

type AddGroupInput = Omit<Group, "id" | "CreatedAt">;
type UpdateGroupInput = {
  group: Group;
  newData: Partial<Omit<Group, "id" | "createdAt">>;
};

export interface UseDashboardDatasResult {
  groups: Group[];
  notes: Note[];
  loading: boolean;
  error: Error | null;
  addNote: (note: AddNoteInput) => Promise<void>;
  updateNote: (note: UpdateNoteInput) => Promise<void>;
  deleteNote: (note: deleteNoteInput) => Promise<void>;
  addGroup: (group: AddGroupInput) => Promise<void>;
  updateGroup: (group: UpdateGroupInput) => Promise<void>;
}

export function useDashboardData(): UseDashboardDatasResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const notesUnsubscribers = useRef<Array<() => void>>([]);

  const [notes, setNotes] = useState<Note[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // const notesRef = useMemo(() => collection(db, "notes"), []);
  const groupsRef = useMemo(() => collection(db, "groups"), []);

  // use effect for groups and this is a dependency of the folling use effect

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

  useEffect(() => {
    notesUnsubscribers.current.forEach((unsubscribe: () => void) =>
      unsubscribe()
    );
    notesUnsubscribers.current = [];
    setNotes([]);

    const visibleGroups = groups.filter((group) => !group.isHidden);

    visibleGroups.forEach((group) => {
      const notesRef = collection(db, "groups", group.id, "notes");
      const unsubscribe = onSnapshot(notesRef, (snapshot) => {
        const groupNotes = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
              groupId: group.id,
              groupName: group.name,
            } as Note)
        );

        setNotes((prevNotes) => [
          ...prevNotes.filter((note) => note.groupId !== group.id), // Remove old notes from this group
          ...groupNotes, // Add new notes from this group
        ]);
      });

      notesUnsubscribers.current.push(unsubscribe);
    });

    return () => {
      notesUnsubscribers.current.forEach((unsubscribe) => unsubscribe());
      notesUnsubscribers.current = [];
    };
  }, [groups]);

  const addNote = useCallback(
    async (data: AddNoteInput) => {
      try {
        const notesRef = collection(groupsRef, data.groupId, "notes");
        await addDoc(notesRef, {
          content: data.content,
          status: data.status,
          dueDate: data.dueDate,
        });
      } catch (error) {
        setError(error as ServerError);
        console.log(error);
      }
    },
    [groupsRef]
  );

  const updateNote = useCallback(
    async ({ note, newData }: UpdateNoteInput) => {
      if (!note) {
        console.error("Cannot save: No note ID provided");
        setError(new Error("Cannot save: No notebook ID provided."));
        return;
      }
      setError(null);
      try {
        const { groupId: newGroupId, ...noteDataWithoutGroupId } = newData;
        const batch = writeBatch(db);
        const noteRef = doc(groupsRef, note.groupId, "notes", note.id);

        // if group id is different then we have to move the note to the new collection
        if (newGroupId && newGroupId !== note.groupId) {
          const newNoteRef = doc(groupsRef, newGroupId, "notes", note.id);

          const docSnap = await getDoc(noteRef);

          if (!docSnap.exists) {
            throw new NotFoundError("Note not found");
          }
          batch.set(newNoteRef, {
            ...docSnap.data(),
            ...noteDataWithoutGroupId,
            updatedAt: new Date(),
          });

          batch.delete(noteRef);
          await batch.commit();
        } else {
          if (Object.keys(noteDataWithoutGroupId).length > 0) {
            batch.update(noteRef, {
              ...noteDataWithoutGroupId,
              updatedAt: new Date(),
            });
            await batch.commit();
          }
        }
      } catch (error) {
        setError(error as Error);
      }
    },
    [groupsRef]
  );

  const deleteNote = useCallback(
    async ({ groupId, noteId }: deleteNoteInput) => {
      if (!noteId || !groupId) {
        console.error("Cannot delete: No note or group ID provided");
        setError(new Error("Cannot save: No notebook ID provided."));
        return;
      }
      setError(null);
      try {
        const noteRef = doc(groupsRef, groupId, "notes", noteId);
        await deleteDoc(noteRef);
      } catch (error) {
        setError(error as ServerError);
      }
    },
    [groupsRef]
  );

  const addGroup = useCallback(
    async (data: AddGroupInput) => {
      try {
        await addDoc(groupsRef, {
          ...data,
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
        if (Object.keys(newData).length > 0) {
          const groupRef = doc(groupsRef, group.id);
          await updateDoc(groupRef, {
            ...newData,
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        setError(error as ServerError);
      }
    },
    [groupsRef]
  );

  return {
    groups,
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    addGroup,
    updateGroup,
  };
}
