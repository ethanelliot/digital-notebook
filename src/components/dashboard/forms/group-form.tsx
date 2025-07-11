import { Button } from '@/components/ui/button'
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
import { groupColors, visibility } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Group, GroupColor } from '@/types/group'
import { AlertCircleIcon, Check, ChevronsUpDown } from 'lucide-react'
import { forwardRef, useState } from 'react'

interface GroupFormProps {
  onSubmit: (data: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => void
  initialData?: Group
}

export const GroupForm = forwardRef<HTMLFormElement, GroupFormProps>(
  ({ onSubmit, initialData }, ref) => {
    const [formData, setFormData] = useState({
      name: initialData?.name ?? '',
      isHidden: initialData?.isHidden ?? false,
      color: initialData?.color ?? '',
    })

    const [error, setError] = useState('')
    const handleSubmit = () => {
      if (!formData.name) {
        setError('Name cannot be empty')
      } else if (!formData.color) {
        setError('Color cannot be empty')
      } else {
        setError('')
        onSubmit({
          name: formData.name,
          isHidden: formData.isHidden,
          color: formData.color as GroupColor,
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
          <Label htmlFor="name-1">Name</Label>
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
          <Label htmlFor="Visibility-picker" className="px-1">
            Visability
          </Label>
          <Select
            value={String(formData.isHidden)}
            onValueChange={(value: string) =>
              setFormData((prev) => ({ ...prev, isHidden: value === 'true' }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visibility.map((value) => (
                <SelectItem
                  value={String(value.value)}
                  key={String(value.value)}
                >
                  <value.icon />
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="Visibility-picker" className="px-1">
            Color
          </Label>
          <Popover modal={false}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className=" justify-between"
              >
                {groupColors[formData.color as GroupColor] ? (
                  <span className="flex gap-1  items-center">
                    <div
                      className={cn(
                        'h-4 w-4 rounded-full',
                        groupColors[formData.color as GroupColor].background
                      )}
                    ></div>
                    {groupColors[formData.color as GroupColor].label}
                  </span>
                ) : (
                  'Select Color...'
                )}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0  w-[var(--radix-popover-trigger-width)]"
              align={'start'}
            >
              <Command>
                <CommandInput placeholder="Search Color..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No Color found.</CommandEmpty>
                  <CommandGroup>
                    {Object.values(groupColors).map((color) => (
                      <CommandItem
                        key={color.value}
                        value={color.value}
                        onSelect={() => {
                          setFormData((prev) => ({
                            ...prev,
                            color: color.value,
                          }))
                        }}
                      >
                        <span className="flex gap-1 items-center">
                          <div
                            className={cn(
                              'h-4 w-4 rounded-full',
                              color.background
                            )}
                          ></div>
                          {color.label}
                        </span>
                        <Check
                          className={cn(
                            'ml-auto',
                            formData.color === color.value
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
