import React from "react";
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
import { useDialog } from "@/contexts/dialog-context";

interface NotebookActionsProps {
  notebook: Notebook;
}

const NotebookActions: React.FC<NotebookActionsProps> = ({ notebook }) => {
  const { deleteNotebook } = useWorkspaceContext();

  const { openDialog, openConfirm } = useDialog();

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
          <DropdownMenuItem
            onClick={() => openDialog("notebookForm", { notebook })}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              void navigator.clipboard.writeText(notebook.id);
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
                  void deleteNotebook({ notebookId: notebook.id });
                },
              });
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default NotebookActions;
