import { useCurrentEditor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Bold,
  Italic,
  Strikethrough,
  ChevronDown,
  List,
  ListOrdered,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Undo,
  Redo,
  ArrowLeft,
  SquareCode,
  ListCheck,
} from "lucide-react"; // Example icons
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

interface EditorToolbarProps {
  title: string;
  setTitle: (title: string) => void;
}

const EditorToolbar = ({ title, setTitle }: EditorToolbarProps) => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full relative flex items-center justify-between gap-2 p-2 border-border bg-background border-b py-4 md:py-6">
      <div className="flex items-center gap-2">
        <Button variant={"outline"} size="icon">
          <ArrowLeft />
        </Button>
        <Input
          type="text"
          placeholder="Notebook Name"
          className="w-64"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>
      <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo />
          </Button>
          <Button
            variant="outline"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-12 h-9 rounded-md px-3">
                <span className="flex items-center">
                  {editor.isActive("heading", { level: 1 }) ? (
                    <Heading1 />
                  ) : editor.isActive("heading", { level: 2 }) ? (
                    <Heading2 />
                  ) : editor.isActive("heading", { level: 3 }) ? (
                    <Heading3 />
                  ) : (
                    <Heading />
                  )}
                  <ChevronDown />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onSelect={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                }}
              >
                <Heading1 /> Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                <Heading2 /> Heading 2
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                <Heading3 /> Heading 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-12 h-9 rounded-md px-3">
                <span className="flex items-center">
                  {editor.isActive("bulletList") ? (
                    <List />
                  ) : editor.isActive("orderedList") ? (
                    <ListOrdered />
                  ) : editor.isActive("taskList") ? (
                    <ListCheck />
                  ) : (
                    <List />
                  )}
                  <ChevronDown />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onSelect={() => {
                  editor.chain().focus().toggleBulletList().run();
                }}
              >
                <List /> Bullet List
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered /> Ordered List
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleTaskList().run()}
              >
                <ListCheck /> Task List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={() => editor.chain().focus().setCodeBlock().run()}
            disabled={!editor.can().chain().focus().setCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "is-active" : ""}
          >
            <SquareCode />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Toggle
            variant="outline"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <Bold />
          </Toggle>
          <Toggle
            variant="outline"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <Italic />
          </Toggle>
          <Toggle
            variant="outline"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <Strikethrough />
          </Toggle>
          <Toggle
            variant="outline"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <Code />
          </Toggle>
        </div>
      </div>
      <ModeToggle />
    </div>
  );
};

export default EditorToolbar;
