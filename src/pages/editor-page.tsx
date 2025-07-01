import { Editor, EditorSkeleton } from "@/components/editor/editor";
import { useNotebookContent } from "@/hooks/use-notebook-content";
import { NotFoundError } from "@/lib/errors";
import { useParams } from "react-router-dom";
import NotFoundPage from "./not-found";
import ErrorPage from "./error";
import { useMemo } from "react";
import { useWorkspaceContext } from "@/contexts/workspace-context";

function EditorPage() {
  const { notebookId } = useParams<{
    notebookId: string;
  }>();

  const { notebookContent, error, saveNotebookContent } = useNotebookContent(
    notebookId || ""
  );

  const { notebooks, updateNotebook } = useWorkspaceContext();

  const notebook = useMemo(() => {
    if (!notebookId) return null;
    return notebooks.find((n) => n.id === notebookId);
  }, [notebooks, notebookId]);

  if (error) {
    if (error instanceof NotFoundError) {
      return <NotFoundPage />;
    } else {
      return <ErrorPage />;
    }
  }

  if (!notebookContent || !notebook) {
    return <EditorSkeleton />;
  }

  return (
    <Editor
      notebookName={notebook.name}
      notebookContent={notebookContent}
      saveNotebookName={(name) => {
        updateNotebook({ notebook, newData: { name } });
      }}
      saveNotebookContent={saveNotebookContent}
    />
  );
}

export default EditorPage;
