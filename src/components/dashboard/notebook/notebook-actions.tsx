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
import { useWorkspaceContext } from "@/contexts/workspace-context";
import type { Notebook } from "@/types/notebook";
import NotebookFormDialog from "../dialog/notebook-form-dialog";
import { useDialog } from "@/contexts/dialog-context";

interface NotebookActionsProps {
  notebook: Notebook;
}

const NotebookActions: React.FC<NotebookActionsProps> = ({ notebook }) => {
  const [isNotebookDialogOpen, setIsNotebookDialogOpen] = useState(false);
  const { deleteNotebook } = useWorkspaceContext();

  const { openConfirm } = useDialog();

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
              openConfirm({
                title: "Are you absolutely sure?",
                message:
                  "This action cannot be undone. This will permanently delete your item from our servers",
                onConfirm: () => {
                  deleteNotebook({ notebookId: notebook.id });
                },
              });
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
    </>
  );
};

export default NotebookActions;
