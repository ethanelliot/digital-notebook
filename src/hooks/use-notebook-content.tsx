// src/hooks/useNotebook.ts

import { auth, db } from '@/firebase'
import { NotFoundError, ServerError } from '@/lib/errors'
import type { JSONContent } from '@tiptap/react'
import { doc, getDoc, updateDoc, DocumentReference } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

interface UseNotebookContentResult {
  notebookContent: JSONContent | null
  loading: boolean
  error: Error | null
  saveNotebookContent: (content: JSONContent) => Promise<void>
}

export function useNotebookContent(
  notebookId: string
): UseNotebookContentResult {
  const [notebookRef, setNotebookRef] = useState<DocumentReference | null>(null)

  const [notebookContent, setNotebookContent] = useState<JSONContent | null>(
    null
  )
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // todo add snapshot listener
  useEffect(() => {
    if (!auth.currentUser) {
      setError(new Error('User is not authenticated'))
      return
    }

    if (!notebookId) {
      setNotebookContent(null)
      setLoading(false)
      setError(null)
      console.log('No notebook or Group ID provided.')
      return
    }

    setLoading(true)
    setError(null)

    const fetchNotebookData = async () => {
      try {
        const notebookDocRef = doc(
          db,
          'notebooks',
          notebookId,
          'content',
          'main'
        )

        const notebookSnap = await getDoc(notebookDocRef)

        if (!notebookSnap.exists()) {
          throw new NotFoundError('Notebook not found.')
        }

        setNotebookRef(notebookDocRef)
        setNotebookContent(notebookSnap.data() as JSONContent)

        console.log('Notebook data loaded:', notebookSnap.data())
      } catch (error) {
        console.error('Error fetching notebook:', error)
        setError(error as ServerError)
        setNotebookContent(null)
      } finally {
        setLoading(false)
      }
    }

    void fetchNotebookData()
  }, [notebookId])

  const saveNotebookContent = useCallback(
    async (content: JSONContent) => {
      if (!notebookId) {
        console.error('Cannot save: No notebook or group ID provided')
        setError(new Error('Cannot save: No notebook ID provided.'))
        return
      }

      setError(null)

      try {
        setNotebookContent(content)

        if (!notebookRef) {
          throw new Error('Cannot save: Notebook reference is not set.')
        }

        await updateDoc(notebookRef, content)

        console.log('Notebook saved successfully!')
      } catch (error) {
        console.error('Error saving notebook:', error)
        setError(error as Error)
      }
    },
    [notebookId, notebookRef]
  )

  return { notebookContent, loading, error, saveNotebookContent }
}
