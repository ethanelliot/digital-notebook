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
import { NotebookForm } from "../forms/notebook-form";
import type { NotebookFormDialogProps } from "@/types/dialog";
import { useDialog } from "@/contexts/dialog-context";

const NotebookFormDialog: React.FC<NotebookFormDialogProps> = ({
  notebook,
}) => {
  const { addNotebook, updateNotebook } = useWorkspaceContext();
  const { state, closeDialog } = useDialog();

  const formRef = useRef<HTMLFormElement>(null);

  const isEditForm = !!notebook;
  return (
    <Dialog open={state.isOpen} onOpenChange={closeDialog}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
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
            closeDialog();
          }}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation(); //this line prevents other popup elements from closing
              closeDialog();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={(e) => {
              e.stopPropagation(); //this line prevents other popup elements from closing
              formRef.current?.requestSubmit();
            }}
          >
            {isEditForm ? "Save Changes" : "Create Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotebookFormDialog;
