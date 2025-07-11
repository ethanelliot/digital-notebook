import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { useWorkspaceContext } from '@/contexts/workspace-context'
import { cn } from '@/lib/utils'
import type { Notebook } from '@/types/notebook'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { AlertCircleIcon, Check, ChevronsUpDown } from 'lucide-react'
import { forwardRef, useState } from 'react'

interface NotebookFormProps {
  onSubmit: (
    data: Omit<
      Notebook,
      'id' | 'createdAt' | 'updatedAt' | 'groupColor' | 'groupName' | 'groupRef'
    >
  ) => void
  initialData?: Notebook
}

export const NotebookForm = forwardRef<HTMLFormElement, NotebookFormProps>(
  ({ onSubmit, initialData }, ref) => {
    const { groups } = useWorkspaceContext()

    const [formData, setFormData] = useState({
      name: initialData?.name ?? '',
      groupId: initialData?.groupId ?? '',
    })

    const [openGroup, setOpenGroup] = useState(false)
    const [error, setError] = useState('')
    const handleSubmit = () => {
      if (!formData.name) {
        setError('Name cannot be empty')
      } else {
        setError('')
        onSubmit({
          name: formData.name,
          groupId: formData.groupId,
        })
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
          <Label htmlFor="name-1">Content</Label>
          <Input
            id="name-1"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="time-picker" className="px-1">
            Group
          </Label>
          <Popover open={openGroup} onOpenChange={setOpenGroup} modal={false}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openGroup}
                className=" justify-between"
              >
                {groups.find((group) => group.id === formData.groupId)?.name
                  ? groups.find((group) => group.id === formData.groupId)?.name
                  : 'Select Group...'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0  w-[var(--radix-popover-trigger-width)]"
              align={'start'}
            >
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
                          {group.name}
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
      </form>
    )
  }
)
