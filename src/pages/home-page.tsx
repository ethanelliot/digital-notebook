import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NotebookActions from '@/components/dashboard/notebook/notebook-actions'
import NotesTable from '@/components/dashboard/notes/notes-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDialog } from '@/contexts/dialog-context'
import { useWorkspaceContext } from '@/contexts/workspace-context'
import { groupColors, statuses } from '@/lib/constants'
import { getRelativeDate } from '@/lib/format-time'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'

const HomePage: React.FC = () => {
  const [upcomingNotes, setUpcomingNotes] = useState<Note[]>([])

  const { notebooks, notes } = useWorkspaceContext()

  const { openDialog } = useDialog()

  useEffect(() => {
    setUpcomingNotes(() => {
      // Example: filter notes for upcoming ones, or just copy all notes
      return notes
        .filter(
          (note) =>
            note.status === 'Not-started' || note.status === 'In-progress'
        )
        .sort(
          (a, b) => a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime()
        )
        .slice(0, 5)
    })
  }, [notes])

  return (
    <div className="container flex flex-col mx-auto gap-4 ">
      <p className="text-3xl font-bold">Home</p>
      <div className="flex gap-4 w-full flex-col sm:flex-row">
        <Card className="w-full min-h-100">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              Track and manage your upcoming notes.
            </CardDescription>
            <CardAction>
              <Button onClick={() => openDialog('noteForm', {})}>
                <Plus /> New
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 overflow-hidden">
            {upcomingNotes.map((note) => {
              const status = statuses.find(
                (status) => status.value === note.status
              )
              return (
                <div
                  key={note.id}
                  className="flex flex-col items-start gap-2 space-x-4 rounded-md border p-4"
                >
                  <p className="font-semibold">{note.content}</p>
                  <div>
                    <Badge variant="outline">
                      {status?.icon && <status.icon />}
                      <span>{status?.label}</span>
                    </Badge>
                    <span className="ml-2 text-sm text-muted-foreground">
                      Due {getRelativeDate(note.dueDate.toDate())}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Notebooks</CardTitle>
            <CardDescription>
              Browse your recently used notebooks.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 overflow-hidden">
            {notebooks.map((notebook) => {
              return (
                <div
                  key={notebook.id}
                  className="flex flex-col items-start gap-2 space-x-4 rounded-md border p-4"
                >
                  <div className="flex w-full justify-between">
                    <Link
                      to={`/notebook/${notebook.id}`}
                      className="font-semibold hover:underline"
                    >
                      {notebook.name}
                    </Link>
                    <NotebookActions notebook={notebook} />
                  </div>

                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="flex gap-1 items-center">
                      <div
                        className={cn(
                          'h-4 w-4 rounded-full',
                          groupColors[notebook.groupColor].background
                        )}
                      ></div>

                      {notebook.groupName}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
      <NotesTable />
    </div>
  )
}

export default HomePage
