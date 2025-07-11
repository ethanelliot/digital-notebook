import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { auth, db } from '@/firebase'
import { MAX_VISIBLE_GROUPS } from '@/lib/constants'
import { ServerError } from '@/lib/errors'
import type { Group } from '@/types/group'
import type { Note, NoteDataFromFirestore } from '@/types/note'
import type { Notebook, NotebookDataFromFirestore } from '@/types/notebook'

type AddNoteInput = Omit<
  Note,
  'id' | 'createdAt' | 'updatedAt' | 'groupName' | 'groupColor' | 'groupRef'
>
interface UpdateNoteInput {
  note: Note
  newData: Partial<
    Omit<
      Note,
      'id' | 'createdAt' | 'updatedAt' | 'groupName' | 'groupColor' | 'groupRef'
    >
  >
}
interface DeleteNoteInput {
  noteId: string
}

type AddGroupInput = Omit<Group, 'id' | 'createdAt' | 'updatedAt'>
interface UpdateGroupInput {
  group: Group
  newData: Partial<Omit<Group, 'id' | 'createdAt'>>
}
interface DeleteGroupInput {
  groupId: string
}

type AddNotebookInput = Omit<
  Notebook,
  'id' | 'createdAt' | 'updatedAt' | 'groupColor' | 'groupName' | 'groupRef'
>
interface UpdateNotebookInput {
  notebook: Notebook
  newData: Partial<
    Omit<
      Notebook,
      'id' | 'createdAt' | 'updatedAt' | 'groupColor' | 'groupName' | 'groupRef'
    >
  >
}
interface DeleteNotebookInput {
  notebookId: string
}

export interface UseWorkspaceDataResult {
  groups: Group[]
  notes: Note[]
  notebooks: Notebook[]
  loading: boolean
  error: Error | null
  addNote: (note: AddNoteInput) => Promise<void>
  updateNote: (note: UpdateNoteInput) => Promise<void>
  deleteNote: (note: DeleteNoteInput) => Promise<void>
  addGroup: (group: AddGroupInput) => Promise<void>
  updateGroup: (group: UpdateGroupInput) => Promise<void>
  deleteGroup: (group: DeleteGroupInput) => Promise<void>
  addNotebook: (notebook: AddNotebookInput) => Promise<string | undefined>
  updateNotebook: (notebook: UpdateNotebookInput) => Promise<void>
  deleteNotebook: (notebook: DeleteNotebookInput) => Promise<void>
}

export function useWorkspaceData(): UseWorkspaceDataResult {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const [notes, setNotes] = useState<Note[]>([])
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [groups, setGroups] = useState<Group[]>([])

  const groupsRef = useMemo(() => collection(db, 'groups'), [])
  const notesRef = useMemo(() => collection(db, 'notes'), [])
  const notebooksRef = useMemo(() => collection(db, 'notebooks'), [])

  useEffect(() => {
    if (!auth.currentUser) {
      setError(new Error('User must be authenticated'))
      return
    }

    const q = query(groupsRef, where('createdBy', '==', auth.currentUser.uid)) // adjust for visability

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newGroups = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Group
        )
        setGroups(newGroups)
      },
      (error) => {
        setError(new ServerError(error.message))
        console.error(error)
      }
    )

    return () => unsubscribe()
  }, [groupsRef])

  const visibleGroups = useMemo(
    () =>
      groups.filter((group) => !group.isHidden).slice(0, MAX_VISIBLE_GROUPS),
    [groups]
  )

  useEffect(() => {
    if (visibleGroups.length === 0) {
      setNotes([])
      setNotebooks([])
      return
    }

    if (!auth.currentUser) {
      setError(new Error('User must be authenticated'))
      return
    }

    const groupRefs: DocumentReference[] = visibleGroups.map((group) =>
      doc(db, 'groups', group.id)
    )

    const notesQuery = query(
      notesRef,
      where('groupRef', 'in', groupRefs),
      where('createdBy', '==', auth.currentUser.uid)
    )

    const notesUnsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const allNotes: Note[] = snapshot.docs.map((doc) => {
        const noteData = doc.data() as NoteDataFromFirestore

        const group = visibleGroups.find(
          (group) => group.id === noteData.groupRef.id
        )

        return {
          ...noteData,
          groupColor: group?.color,
          groupName: group?.name,
          groupId: group?.id,
        } as Note
      })
      setNotes(allNotes)
    })

    const notebookQuery = query(
      notebooksRef,
      where('groupRef', 'in', groupRefs),
      where('createdBy', '==', auth.currentUser.uid)
    )

    const notebooksUnsubscribe = onSnapshot(notebookQuery, (snapshot) => {
      const allNotebooks: Notebook[] = snapshot.docs.map((doc) => {
        const noteData = doc.data() as NotebookDataFromFirestore

        const group = visibleGroups.find(
          (group) => group.id === noteData.groupRef.id
        )

        return {
          ...noteData,
          groupId: group?.id,
          groupName: group?.name,
          groupColor: group?.color,
        } as Notebook
      })
      setNotebooks(allNotebooks)
    })

    setLoading(false)

    return () => {
      notesUnsubscribe()
      notebooksUnsubscribe()
    }
  }, [visibleGroups, notesRef, notebooksRef])

  const addNote = useCallback(
    async (data: AddNoteInput) => {
      try {
        if (!auth.currentUser) {
          setError(new Error('User must be authenticated to create notes'))
          return
        }

        const groupRef = doc(groupsRef, data.groupId)

        await addDoc(notesRef, {
          content: data.content,
          status: data.status,
          dueDate: data.dueDate,
          groupRef: groupRef,
          createdBy: auth.currentUser.uid,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        })
      } catch (error) {
        setError(error as ServerError)
        console.log(error)
      }
    },
    [groupsRef, notesRef]
  )

  const updateNote = useCallback(
    async ({ note, newData }: UpdateNoteInput) => {
      if (!auth.currentUser) {
        setError(new Error('User must be authenticated to update notes'))
        return
      }

      if (!note) {
        console.error('Cannot save: No note ID provided')
        setError(new Error('Cannot save: No notebook ID provided.'))
        return
      }

      try {
        const { groupId: newGroupId, ...newNoteDataWithoutGroupId } = newData
        const noteRef = doc(notesRef, note.id)

        // if the note is in a new group
        let groupRef
        if (newGroupId && newGroupId !== note.groupId) {
          groupRef = doc(groupsRef, newGroupId)
        } else {
          groupRef = note.groupRef
        }

        await updateDoc(noteRef, {
          ...newNoteDataWithoutGroupId,
          groupRef: groupRef,
          updatedAt: serverTimestamp(),
        })
      } catch (error) {
        setError(error as Error)
      }
    },
    [groupsRef, notesRef]
  )

  const deleteNote = useCallback(
    async ({ noteId }: DeleteNoteInput) => {
      if (!auth.currentUser) {
        setError(new Error('User must be authenticated to delete notes'))
        return
      }

      if (!noteId) {
        console.error('Cannot delete: No note or group ID provided')
        setError(new Error('Cannot save: No notebook ID provided.'))
        return
      }
      setError(null)
      try {
        const noteRef = doc(notesRef, noteId)
        await deleteDoc(noteRef)
      } catch (error) {
        setError(error as ServerError)
      }
    },
    [notesRef]
  )

  const addGroup = useCallback(
    async (data: AddGroupInput) => {
      if (!auth.currentUser) {
        setError(new Error('User must be authenticated to add groups'))
        return
      }

      try {
        await addDoc(groupsRef, {
          ...data,
          createdBy: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      } catch (error) {
        setError(error as ServerError)
        console.log(error)
      }
    },
    [groupsRef]
  )

  const updateGroup = useCallback(
    async ({ group, newData }: UpdateGroupInput) => {
      if (!auth.currentUser) {
        setError(new Error('User must be authenticated to update groups'))
        return
      }

      try {
        // TODO check if there are updates...   if (Object.keys(newData).length > 0)
        const groupRef = doc(groupsRef, group.id)
        await updateDoc(groupRef, {
          ...newData,
          updatedAt: serverTimestamp(),
        })
      } catch (error) {
        setError(error as ServerError)
      }
    },
    [groupsRef]
  )

  const deleteGroup = useCallback(
    async ({ groupId }: DeleteGroupInput) => {
      if (!auth.currentUser) {
        setError(new Error('User must be authenticated to delete groups'))
        return
      }

      if (!groupId) {
        console.error('Cannot delete: No group ID provided')
        setError(new Error('Cannot save: No notebook ID provided.'))
        return
      }
      try {
        // need a batch query here as we must delete notes and notebooks of group safely (all at once)
        const batch = writeBatch(db)

        const groupRef = doc(groupsRef, groupId)

        const notesQuery = await getDocs(
          query(notesRef, where('groupRef', '==', groupRef))
        )

        notesQuery.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })

        const notebookQuery = await getDocs(
          query(notebooksRef, where('groupRef', '==', groupRef))
        )

        notebookQuery.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })

        batch.delete(groupRef)

        await batch.commit()
      } catch (error) {
        setError(error as ServerError)
      }
    },
    [groupsRef, notesRef, notebooksRef]
  )

  const addNotebook = useCallback(
    async (data: AddNotebookInput) => {
      if (!auth.currentUser) {
        setError(new Error('User must be authenticated to add notebooks'))
        return
      }

      try {
        const groupRef = doc(groupsRef, data.groupId)

        const notebookRef = await addDoc(notebooksRef, {
          ...data,
          groupRef: groupRef,
          createdBy: auth.currentUser.uid,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        })

        const contentCollectionRef = collection(notebookRef, 'content')

        const notebookMainContentDocRef = doc(contentCollectionRef, 'main')

        await setDoc(notebookMainContentDocRef, {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Start typing to get started!',
                },
              ],
            },
          ],
        })

        return notebookRef.id
      } catch (error) {
        setError(error as ServerError)
        console.log(error)
      }
    },
    [groupsRef, notebooksRef]
  )

  const updateNotebook = useCallback(
    async ({ notebook, newData }: UpdateNotebookInput) => {
      if (!auth.currentUser) {
        setError(new Error('User must be authenticated to update notebooks'))
        return
      }
      try {
        const { groupId: newGroupId, ...newNotebookDataWithoutGroupId } =
          newData
        const notebookRef = doc(notebooksRef, notebook.id)

        console.log(newGroupId)
        let groupRef
        if (newGroupId && newGroupId !== notebook.groupId) {
          groupRef = doc(groupsRef, newGroupId)
        } else {
          groupRef = notebook.groupRef
        }

        await updateDoc(notebookRef, {
          ...newNotebookDataWithoutGroupId,
          groupRef: groupRef,
          updatedAt: serverTimestamp(),
        })
      } catch (error) {
        setError(error as ServerError)
      }
    },
    [groupsRef, notebooksRef]
  )

  const deleteNotebook = useCallback(
    async ({ notebookId }: DeleteNotebookInput) => {
      if (!auth.currentUser) {
        setError(new Error('User must be authenticated to delete notebooks'))
        return
      }
      if (!notebookId) {
        console.error('Cannot delete: No group or notebook ID provided')
        setError(new Error('Cannot save: No notebook ID provided.'))
        return
      }
      try {
        const batch = writeBatch(db)

        const notebookRef = doc(notebooksRef, notebookId)
        const notebookContentRef = doc(notebookRef, 'content', 'main')

        batch.delete(notebookContentRef)
        batch.delete(notebookRef)

        await batch.commit()
      } catch (error) {
        setError(error as ServerError)
      }
    },
    [notebooksRef]
  )

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
  }
}
