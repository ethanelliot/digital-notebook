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
import { useEffect, useRef, useState } from "react";
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
  const [title, setTitle] = useState(notebook.title || "");

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

  useEffect(() => {
    if (title) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        saveNotebook({ title });
      }, 1000);
    }
  }, [title]);

  return (
    <div className="flex flex-col h-screen">
      <EditorContext.Provider value={{ editor }}>
        <div className="sticky top-0 z-50 bg-white">
          <EditorToolbar title={title} setTitle={setTitle} />
        </div>

        <div className="lg:w-1/3 md:w-2/3 md:mx-auto flex-grow sm:w-auto mx-10 ">
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
        <div className="w-full relative flex flex-wrap items-center justify-between gap-2 p-2 border-border bg-background border-b py-4 md:py-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Skeleton className="rounded-md h-9 px-2 min-w-9" />
            <Skeleton className="rounded-md h-9 px-2 w-64" />
          </div>
          <div className="flex-grow flex justify-center w-full order-last md:w-auto  md:justify-start  md:static  md:order-none lg:order-none lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:w-auto">
            <Skeleton className="rounded-md  h-9 px-2 min-w-128" />
          </div>
          <div className="flex-shrink-0">
            <Skeleton className="rounded-md  h-9 px-2 min-w-9" />
          </div>
        </div>
      </div>

      <div className="lg:w-1/3 md:w-2/3 md:mx-auto flex-grow sm:w-auto mx-10 ">
        <div className="md:w-1/3 md:mx-auto flex-grow sm:w-full sm:mx-10">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
