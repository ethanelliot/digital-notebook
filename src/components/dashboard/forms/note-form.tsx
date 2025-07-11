import { Timestamp } from 'firebase/firestore'
import {
  AlertCircleIcon,
  Check,
  ChevronDownIcon,
  ChevronsUpDown,
} from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWorkspaceContext } from '@/contexts/workspace-context'
import { groupColors, statuses } from '@/lib/constants'
import { formatTimeFromTimestamp } from '@/lib/format-time'
import { cn } from '@/lib/utils'
import type { Note, statusType } from '@/types/note'

interface NoteFormProps {
  onSubmit: (
    data: Omit<
      Note,
      'id' | 'createdAt' | 'updatedAt' | 'groupName' | 'groupRef' | 'groupColor'
    >
  ) => void
  initialData?: Partial<Omit<Note, 'id'>> | null
}

export const NoteForm = React.forwardRef<HTMLFormElement, NoteFormProps>(
  ({ onSubmit, initialData }, ref) => {
    const { groups } = useWorkspaceContext()

    const [formData, setFormData] = useState({
      content: initialData?.content ?? '',
      dueDate: initialData?.dueDate?.toDate() ?? undefined,
      dueTime: formatTimeFromTimestamp(initialData?.dueDate?.toDate()),
      status: initialData?.status ?? 'Not-started',
      groupId: initialData?.groupId ?? '',
    })
    const [openDate, setOpenDate] = useState(false)
    const [openGroup, setOpenGroup] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = () => {
      if (!formData.content) {
        setError('Content cannot be empty')
      } else if (!formData.dueDate) {
        setError('A note must have a due date')
      } else if (!formData.groupId) {
        setError('A note must have a group.')
      } else {
        setError('')

        const date = formData.dueDate

        // Add hours and mins to date
        if (formData.dueTime) {
          console.log(formData.dueTime)
          const [hours, minutes] = formData.dueTime.split(':').map(Number)
          date.setHours(hours)
          date.setMinutes(minutes)
        }

        const timestamp = Timestamp.fromDate(date)

        onSubmit({
          content: formData.content,
          dueDate: timestamp,
          status: formData.status,
          groupId: formData.groupId,
        })
        // The DialogClose will be triggered by the wrapping DialogClose component
      }
    }

    return (
      <form
        ref={ref}
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        {error && (
          <div className="text-destructive flex gap-2 items-center mx-2 text-sm">
            <AlertCircleIcon size={16} />
            <span>{error} </span>
          </div>
        )}
        <div className="grid gap-3">
          <Label htmlFor="content-1">Content</Label>
          <Input
            id="content-1"
            name="content"
            placeholder="content"
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-3 flex-1">
            <Label htmlFor="date-picker" className="px-1">
              Due Date
            </Label>
            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker"
                  className="justify-between font-normal"
                >
                  {formData.dueDate
                    ? formData.dueDate.toLocaleDateString()
                    : 'Select date'}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setFormData((prev) => ({ ...prev, dueDate: date }))
                    setOpenDate(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-3  flex-1">
            <Label htmlFor="time-picker" className="px-1">
              Due Time
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="1800"
              value={formData.dueTime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dueTime: (e.target as HTMLInputElement).value,
                }))
              }
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-3 flex-1">
            <Label htmlFor="time-picker" className="px-1">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: statusType) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((value) => (
                  <SelectItem value={value.value} key={value.value}>
                    <value.icon />
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <Label htmlFor="time-picker" className="px-1">
              Group
            </Label>
            <Popover open={openGroup} onOpenChange={setOpenGroup}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openGroup}
                  className=" justify-between"
                >
                  {(() => {
                    const selectedGroup = groups.find(
                      (group) => group.id === formData.groupId
                    )

                    return selectedGroup?.name ? (
                      <span className="flex gap-1 items-center">
                        <div
                          className={cn(
                            'h-4 w-4 rounded-full',
                            selectedGroup.color
                              ? groupColors[selectedGroup.color].background
                              : ''
                          )}
                        ></div>
                        {selectedGroup.name}
                      </span>
                    ) : (
                      'Select Group...'
                    )
                  })()}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search Group..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No Group found.</CommandEmpty>
                    <CommandGroup>
                      {groups
                        .filter((group) => !group.isHidden)
                        .map((group) => (
                          <CommandItem
                            key={group.id}
                            value={group.name}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                groupId: group.id,
                              }))
                              setOpenGroup(false)
                            }}
                          >
                            <span className="flex gap-1">
                              <div
                                className={cn(
                                  'h-4 w-4 rounded-full',
                                  groupColors[group.color].background
                                )}
                              ></div>

                              {group.name}
                            </span>
                            <Check
                              className={cn(
                                'ml-auto',
                                formData.groupId === group.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </form>
    )
  }
)
