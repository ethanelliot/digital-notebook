import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "../dialog/confirm-delete-dialog";
import { useWorkspaceContext } from "@/contexts/workspace-context";
import type { Notebook } from "@/types/notebook";
import NotebookFormDialog from "../dialog/notebook-form-dialog";

interface NotebookActionsProps {
  notebook: Notebook;
}

const NotebookActions: React.FC<NotebookActionsProps> = ({ notebook }) => {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isNotebookDialogOpen, setIsNotebookDialogOpen] = useState(false);
  const { deleteNotebook } = useWorkspaceContext();

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
          <DropdownMenuItem onClick={() => setIsNotebookDialogOpen(true)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(notebook.id);
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
      <NotebookFormDialog
        open={isNotebookDialogOpen}
        onOpenChange={setIsNotebookDialogOpen}
        notebook={notebook}
      />
      {/* alert dialog for deletion confirmation */}
      <ConfirmDeleteDialog
        onConfirm={() => {
          deleteNotebook({ notebookId: notebook.id });
        }}
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
      />
    </>
  );
};

export default NotebookActions;
