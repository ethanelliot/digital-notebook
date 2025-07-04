import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { useWorkspaceContext } from "@/contexts/workspace-context";
import { Button } from "@/components/ui/button";
import { GroupForm } from "../forms/group-form";
import type { GroupFormDialogProps } from "@/types/dialog";
import { useDialog } from "@/contexts/dialog-context";

const GroupFormDialog: React.FC<GroupFormDialogProps> = ({ group }) => {
  const { addGroup, updateGroup } = useWorkspaceContext();
  const { state, closeDialog } = useDialog();
  const formRef = useRef<HTMLFormElement>(null);

  const isEditForm = !!group;
  return (
    <Dialog open={state.isOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditForm ? "Edit" : "Create"} group</DialogTitle>
          <DialogDescription>
            {isEditForm ? "Edit a" : "Create a new"} group here. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <GroupForm
          ref={formRef}
          initialData={group}
          onSubmit={(data) => {
            if (isEditForm) {
              updateGroup({ group, newData: data });
            } else {
              addGroup(data);
            }
            closeDialog();
          }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => closeDialog()}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => formRef.current?.requestSubmit()}
          >
            {isEditForm ? "Save Changes" : "Create Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupFormDialog;
