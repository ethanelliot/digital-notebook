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
import type { Notebook } from "@/types/notebook";
import { NotebookForm } from "../forms/notebook-form";

type NotebookFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notebook?: Notebook;
};
const NotebookFormDialog = ({
  open,
  onOpenChange,
  notebook,
}: NotebookFormDialogProps) => {
  const { addNotebook, updateNotebook } = useWorkspaceContext();
  const formRef = useRef<HTMLFormElement>(null);

  const isEditForm = !!notebook;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditForm ? "Edit" : "Create"} notebook</DialogTitle>
          <DialogDescription>
            {isEditForm ? "Edit a" : "Create a new"} notebook here. Click save
            when you're done.
          </DialogDescription>
        </DialogHeader>
        <NotebookForm
          ref={formRef}
          initialData={notebook}
          onSubmit={(data) => {
            if (isEditForm) {
              updateNotebook({ notebook, newData: data });
            } else {
              addNotebook(data);
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

export default NotebookFormDialog;
