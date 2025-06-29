import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { useDashboardContext } from "@/contexts/dashboard-context";
import type { Group } from "@/types/group";
import { Button } from "@/components/ui/button";
import { GroupForm } from "../forms/group-form";

type GroupFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: Group;
};
const GroupFormDialog = ({
  open,
  onOpenChange,
  group,
}: GroupFormDialogProps) => {
  const { addGroup, updateGroup } = useDashboardContext();
  const formRef = useRef<HTMLFormElement>(null);

  const isEditForm = !!group;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onOpenChange(false);
          }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
