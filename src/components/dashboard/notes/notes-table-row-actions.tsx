import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDialog } from '@/contexts/dialog-context'
import { useWorkspaceContext } from '@/contexts/workspace-context'
import { statuses } from '@/lib/constants'
import type { Note } from '@/types/note'

interface NotesTableRowActionsProps {
  note: Note
}

const NotesTableRowActions: React.FC<NotesTableRowActionsProps> = ({
  note,
}) => {
  const { openConfirm } = useDialog()

  const { updateNote, deleteNote } = useWorkspaceContext()
  const { openDialog } = useDialog()

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
          <DropdownMenuItem onClick={() => openDialog('noteForm', { note })}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Set Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() =>
                    void updateNote({
                      note,
                      newData: { status: status.value },
                    })
                  }
                >
                  <status.icon className="mr-2 h-4 w-4" />
                  <span>{status.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            onClick={() => {
              void navigator.clipboard.writeText(note.id)
            }}
          >
            Copy Firebase ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => {
              openConfirm({
                title: 'Are you absolutely sure?',
                message:
                  'This action cannot be undone. This will permanently delete your item from our servers',
                onConfirm: () => {
                  void deleteNote({ noteId: note.id })
                },
              })
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default NotesTableRowActions
