import { Editor, EditorSkeleton } from "@/components/editor/editor";
import { useNotebook } from "@/hooks/use-notebook";
import { NotFoundError } from "@/lib/errors";
import { useParams } from "react-router-dom";
import NotFoundPage from "./not-found";
import ErrorPage from "./error";

function EditorPage() {
  const { notebookId } = useParams<{
    notebookId: string;
  }>();

  const { notebook, error, saveNotebook } = useNotebook(notebookId || "");

  if (error) {
    if (error instanceof NotFoundError) {
      return <NotFoundPage />;
    } else {
      return <ErrorPage />;
    }
  }

  if (!notebook) {
    return <EditorSkeleton />;
  }

  return <Editor notebook={notebook} saveNotebook={saveNotebook} />;
}

export default EditorPage;
