import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Editor, EditorSkeleton } from '@/components/editor/editor'
import { useWorkspaceContext } from '@/contexts/workspace-context'
import { useNotebookContent } from '@/hooks/use-notebook-content'
import { NotFoundError } from '@/lib/errors'
import ErrorPage from './error-page'
import NotFoundPage from './not-found'

function EditorPage() {
  const { notebookId } = useParams<{
    notebookId: string
  }>()

  const { notebookContent, error, saveNotebookContent } = useNotebookContent(
    notebookId ?? ''
  )

  const { notebooks, updateNotebook } = useWorkspaceContext()

  const notebook = useMemo(() => {
    if (!notebookId) return null
    return notebooks.find((n) => n.id === notebookId)
  }, [notebooks, notebookId])

  if (error) {
    if (error instanceof NotFoundError) {
      return <NotFoundPage />
    } else {
      return <ErrorPage />
    }
  }

  if (!notebookContent || !notebook) {
    return <EditorSkeleton />
  }

  const handleSaveName = async (name: string) => {
    try {
      await updateNotebook({ notebook, newData: { name } })
    } catch (error) {
      // Required: Handle the error
      console.error('Failed to update notebook name:', error)
      // Optional: Show an error message to the user
      // e.g., displayToast('Error updating name', 'error');
      // TODO: error here
    }
  }
  return (
    <Editor
      notebookName={notebook.name}
      notebookContent={notebookContent}
      saveNotebookName={(name) => void handleSaveName(name)}
      saveNotebookContent={saveNotebookContent}
    />
  )
}

export default EditorPage
