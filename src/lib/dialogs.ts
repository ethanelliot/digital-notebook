import ConfirmDialog from '@/components/dashboard/dialog/confirm-dialog'
import GroupFormDialog from '@/components/dashboard/dialog/group-form-dialog'
import NoteFormDialog from '@/components/dashboard/dialog/note-form-dialog'
import NotebookFormDialog from '@/components/dashboard/dialog/notebook-form-dialog'

export const dialogRegistry = {
  confirm: ConfirmDialog,
  groupForm: GroupFormDialog,
  noteForm: NoteFormDialog,
  notebookForm: NotebookFormDialog,
}
