import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NoteForm } from "../forms/note-form";
import { useWorkspaceContext } from "@/contexts/workspace-context";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import type { NoteFormDialogProps } from "@/types/dialog";
import { useDialog } from "@/contexts/dialog-context";

const NoteFormDialog: React.FC<NoteFormDialogProps> = ({
  note,
  defaultValues,
}) => {
  const { addNote, updateNote } = useWorkspaceContext();
  const { state, closeDialog } = useDialog();
  const formRef = useRef<HTMLFormElement>(null);

  const initialData = note || defaultValues;

  const isEditForm = !!note;

  return (
    <Dialog open={state.isOpen} onOpenChange={closeDialog}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{isEditForm ? "Edit" : "Create"} note</DialogTitle>
          <DialogDescription>
            {isEditForm ? "Edit a" : "Create a new"} note here. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <NoteForm
          ref={formRef}
          initialData={initialData}
          onSubmit={(data) => {
            if (note) {
              updateNote({ note, newData: data });
            } else {
              addNote(data);
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

export default NoteFormDialog;
