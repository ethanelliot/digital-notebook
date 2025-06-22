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

const content = `
  <h1>Welcome to the Tiptap Editor</h1>
  <p>This is a simple editor built with Tiptap and React.</p>
  <p>You can start editing this content right away!</p>
`;

const Editor = () => {
  const editor = useEditor({ extensions, content });
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

export default Editor;
