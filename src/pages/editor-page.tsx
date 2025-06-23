import { Editor, EditorSkeleton } from "@/components/editor/editor";
import { useNotebook } from "@/hooks/useNotebook";
import { useParams } from "react-router-dom";

function EditorPage() {
  const { id } = useParams<{ id: string }>();

  const { notebook, saveNotebook } = useNotebook(id || "");

  if (!notebook) {
    return <EditorSkeleton />;
  }

  return <Editor notebook={notebook} saveNotebook={saveNotebook} />;
}

export default EditorPage;
