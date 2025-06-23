import {
  EditorContent,
  EditorContext,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./editor-toolbar";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TaskItemNodeView from "./task-item-node-view";
import type { NotebookData } from "@/types/notebook";
import { useRef } from "react";
import { Skeleton } from "../ui/skeleton";

const extensions = [
  StarterKit,
  TaskList,
  TaskItem.extend({
    nested: false,
    addNodeView() {
      return ReactNodeViewRenderer(TaskItemNodeView);
    },
  }),
];

interface EditorProps {
  notebook: NotebookData;
  saveNotebook: (newData: Record<string, unknown>) => void;
}

export const Editor = ({ notebook, saveNotebook }: EditorProps) => {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const editor = useEditor({ extensions, content: notebook.content });

  editor?.on("update", ({ editor }) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      saveNotebook({
        content: editor.getJSON(),
      });
    }, 1000);
  });

  return (
    <div className="flex flex-col h-screen">
      <EditorContext.Provider value={{ editor }}>
        <div className="sticky top-0 z-50 bg-white">
          <EditorToolbar />
        </div>

        <div className="w-1/3 mx-auto flex-grow">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </EditorContext.Provider>
    </div>
  );
};

export function EditorSkeleton() {
  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-50 bg-white">
        <div className="w-full relative flex items-center justify-between gap-2 p-2 border-border bg-background border-b py-4 md:py-6">
          <div className="flex items-center gap-2">
            <Skeleton className="rounded-md h-9 px-2 min-w-9" />
            <Skeleton className="rounded-md h-9 px-2 w-64" />
          </div>
          <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <Skeleton className="rounded-md  h-9 px-2 min-w-128" />
          </div>
          <Skeleton className="rounded-md  h-9 px-2 min-w-9" />
        </div>
      </div>

      <div className="w-1/3 mx-auto flex-grow my-5">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
