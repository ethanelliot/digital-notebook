import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleCheck, Clock, MoreHorizontal, RefreshCcw } from "lucide-react";
import { useNotesContext } from "@/contexts/notes-context";
import { Button } from "@/components/ui/button";
import type { Note } from "@/types/Note";

interface DataTableRowActionsProps {
  note: Note;
}

const DataTableRowActions: React.FC<DataTableRowActionsProps> = ({ note }) => {
  const { updateNote, deleteNote } = useNotesContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log(note.id)}>
          Edit
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Set Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() =>
                updateNote({ newData: { status: "Completed" }, id: note.id })
              }
            >
              <CircleCheck />
              <span>Completed</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateNote({ newData: { status: "In-progress" }, id: note.id })
              }
            >
              <RefreshCcw />
              <span>In progress</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateNote({ newData: { status: "Not-started" }, id: note.id })
              }
            >
              <Clock />
              <span>Not started</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(note.id);
          }}
        >
          Copy Firebase ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => {
            deleteNote(note.id);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableRowActions;
