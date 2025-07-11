import type { Group } from "./group";
import type { Note } from "./note";
import type { Notebook } from "./notebook";

export default interface DialogTypes {
  confirm: ConfirmDialogProps;
  groupForm: GroupFormDialogProps;
  noteForm: NoteFormDialogProps;
  notebookForm: NotebookFormDialogProps;
}

export interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export interface GroupFormDialogProps {
  group?: Group;
};

export interface NotebookFormDialogProps {
  notebook?: Notebook;
};

export interface NoteFormDialogProps {
  note?: Note; // pass note if edit form
  defaultValues?: Partial<Note>; // default values for explicity setting intial values of feilds
};

