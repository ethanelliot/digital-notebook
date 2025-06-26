import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Note } from "@/types/Note";
import {
  AlertCircleIcon,
  Check,
  ChevronDownIcon,
  ChevronsUpDown,
} from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { formatTimeFromTimestamp } from "@/lib/format-time";
import { Timestamp } from "firebase/firestore";

const groups = [
  {
    value: "school",
    label: "School",
  },
  {
    value: "work",
    label: "Work",
  },
  {
    value: "personal",
    label: "Personal",
  },
];
interface NoteFormProps {
  onSubmit: (data: Omit<Note, "id" | "createdAt">) => void;
  initialData?: Omit<Note, "id"> | null;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    content: initialData?.content || "",
    dueDate: initialData?.dueDate?.toDate() || undefined,
    dueTime: formatTimeFromTimestamp(initialData?.dueDate.toDate()),
    status: initialData?.status || "Not-started",
    group: initialData?.group || "",
  });
  const [openDate, setOpenDate] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!formData.content) {
      setError("Content cannot be empty");
    } else if (!formData.dueDate) {
      setError("A note must have a due date");
    } else if (!formData.group) {
      setError("A note must have a group.");
    } else {
      setError("");

      const timeString = "20:42";
      const [hours, minutes] = timeString.split(":").map(Number);

      const date = formData.dueDate;

      date.setHours(hours);
      date.setMinutes(minutes);

      const timestamp = Timestamp.fromDate(date);

      onSubmit({
        content: formData.content,
        dueDate: timestamp,
        status: formData.status,
        group: formData.group,
      });
      // The DialogClose will be triggered by the wrapping DialogClose component
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
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
                  : "Select date"}
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
                  setFormData((prev) => ({ ...prev, dueDate: date }));
                  setOpenDate(false);
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
            onValueChange={(
              value: "In-progress" | "Completed" | "Not-started"
            ) => setFormData((prev) => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not-started">Not-started</SelectItem>
              <SelectItem value="In-progress">In-progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
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
                {formData.group ? formData.group : "Select framework..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command
                value={formData.group}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, group: value }))
                }
              >
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {groups.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setFormData((prev) => ({
                            ...prev,
                            group: currentValue,
                          }));
                          setOpenGroup(false);
                        }}
                      >
                        {framework.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            formData.group === framework.value
                              ? "opacity-100"
                              : "opacity-0"
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

      <div className="flex flex-row-reverse">
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
};
