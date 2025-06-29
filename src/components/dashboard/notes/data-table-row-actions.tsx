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
import { useDashboardContext } from "@/contexts/dashboard-context";
import { Button } from "@/components/ui/button";
import type { Note } from "@/types/note";
import { NoteFormDialog } from "../dialog/note-form-dialog";
import { ConfirmDeleteDialog } from "../dialog/confirm-delete-dialog";
import { statuses } from "@/lib/constants";

interface DataTableRowActionsProps {
  note: Note;
}

const DataTableRowActions: React.FC<DataTableRowActionsProps> = ({ note }) => {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  const { updateNote, deleteNote } = useDashboardContext();

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
              setIsDeleteAlertOpen(true);
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

      {/* alert dialog for deletion confirmation */}
      <ConfirmDeleteDialog
        onConfirm={() => {
          deleteNote({ noteId: note.id, groupId: note.groupId });
        }}
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
      />
    </>
  );
};

export default DataTableRowActions;
