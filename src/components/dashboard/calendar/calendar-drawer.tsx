import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useDialog } from '@/contexts/dialog-context'
import { groupColors, statuses } from '@/lib/constants'
import { getEndOfDayTimestamp } from '@/lib/format-time'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'

interface CalendarDrawerProps {
  open: boolean
  setIsOpen: (open: boolean) => void
  notes: Note[]
  date: Date
}

const CalendarDrawer: React.FC<CalendarDrawerProps> = ({
  open,
  setIsOpen,
  notes,
  date,
}) => {
  const { openDialog } = useDialog()
  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{format(date, 'd MMM yyyy')}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          {notes.length > 0
            ? notes.map((note) => {
                const status = statuses.find(
                  (status) => status.value === note.status
                )
                return (
                  <div
                    key={note.id}
                    className={cn(
                      'w-full rounded-sm p-2',
                      groupColors[note.groupColor].background,
                      groupColors[note.groupColor].text
                    )}
                    onClick={() => {
                      openDialog('noteForm', {
                        note: note,
                      })
                    }}
                  >
                    <p className="font-semibold truncate hover:overflow-visible hover:whitespace-normal">
                      {note.content}
                    </p>
                    <p className="text-[10px]">{note.groupName}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[8px] px-1',
                        groupColors[note.groupColor].text,
                        groupColors[note.groupColor].border
                      )}
                    >
                      {status?.icon && <status.icon size={2} />}
                      <span>{status?.label}</span>
                    </Badge>
                  </div>
                )
              })
            : 'No notes'}
        </div>

        <DrawerFooter>
          <Button
            onClick={() => {
              openDialog('noteForm', {
                defaultValues: {
                  dueDate: getEndOfDayTimestamp(date),
                },
              })
            }}
          >
            <Plus /> new
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CalendarDrawer
