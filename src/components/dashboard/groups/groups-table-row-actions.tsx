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
import type { Group } from "@/types/group";
import GroupFormDialog from "../dialog/group-form-dialog";
import { useWorkspaceContext } from "@/contexts/workspace-context";

interface GroupsTableRowActionsProps {
  group: Group;
}

const GroupsTableRowActions: React.FC<GroupsTableRowActionsProps> = ({
  group,
}) => {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const { deleteGroup } = useWorkspaceContext();

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
          <DropdownMenuItem onClick={() => setIsGroupDialogOpen(true)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(group.id);
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

      <GroupFormDialog
        open={isGroupDialogOpen}
        onOpenChange={setIsGroupDialogOpen}
        group={group}
      />

      {/* alert dialog for deletion confirmation */}
      <ConfirmDeleteDialog
        onConfirm={() => {
          deleteGroup({ groupId: group.id });
        }}
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
      />
    </>
  );
};

export default GroupsTableRowActions;
