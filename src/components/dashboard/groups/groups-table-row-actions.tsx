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
import type { Group } from "@/types/group";
import { useWorkspaceContext } from "@/contexts/workspace-context";
import { useDialog } from "@/contexts/dialog-context";

interface GroupsTableRowActionsProps {
  group: Group;
}

const GroupsTableRowActions: React.FC<GroupsTableRowActionsProps> = ({
  group,
}) => {
  const { deleteGroup } = useWorkspaceContext();

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
            onClick={() => openDialog("groupForm", { group: group })}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              void navigator.clipboard.writeText(group.id);
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
                  void deleteGroup({ groupId: group.id });
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

export default GroupsTableRowActions;
