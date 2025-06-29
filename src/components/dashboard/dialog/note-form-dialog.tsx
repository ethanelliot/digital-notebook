import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NoteForm } from "../forms/note-form";
import type { Note } from "@/types/note";
import { useDashboardContext } from "@/contexts/dashboard-context";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

type NoteFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: Note;
};

export const NoteFormDialog: React.FC<NoteFormDialogProps> = ({
  open,
  onOpenChange,
  note,
}) => {
  const { addNote, updateNote } = useDashboardContext();
  const formRef = useRef<HTMLFormElement>(null);

  const isEditForm = !!note;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditForm ? "Edit" : "Create"} note</DialogTitle>
          <DialogDescription>
            {isEditForm ? "Edit a" : "Create a new"} note here. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <NoteForm
          ref={formRef}
          initialData={note}
          onSubmit={(data) => {
            if (note) {
              updateNote({ note, newData: data });
            } else {
              addNote(data);
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
