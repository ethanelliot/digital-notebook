import React, { useState } from "react";
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
import { MoreHorizontal } from "lucide-react";
import { useWorkspaceContext } from "@/contexts/workspace-context";
import { Button } from "@/components/ui/button";
import type { Note } from "@/types/note";
import { NoteFormDialog } from "../dialog/note-form-dialog";
import { statuses } from "@/lib/constants";
import { useDialog } from "@/contexts/dialog-context";

interface NotesTableRowActionsProps {
  note: Note;
}

const NotesTableRowActions: React.FC<NotesTableRowActionsProps> = ({
  note,
}) => {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  const { openConfirm } = useDialog();

  const { updateNote, deleteNote } = useWorkspaceContext();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsNoteDialogOpen(true)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Set Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() =>
                    updateNote({
                      note,
                      newData: { status: status.value },
                    })
                  }
                >
                  <status.icon className="mr-2 h-4 w-4" />
                  <span>{status.label}</span>
                </DropdownMenuItem>
              ))}
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
              openConfirm({
                title: "Are you absolutely sure?",
                message:
                  "This action cannot be undone. This will permanently delete your item from our servers",
                onConfirm: () => {
                  deleteNote({ noteId: note.id });
                },
              });
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog for Edit Note */}

      <NoteFormDialog
        open={isNoteDialogOpen}
        onOpenChange={setIsNoteDialogOpen}
        note={note}
      />
    </>
  );
};

export default NotesTableRowActions;
