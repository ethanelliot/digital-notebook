import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceContext } from "@/contexts/workspace-context";
import { statuses } from "@/lib/constants";
import { getDateRange } from "@/lib/date-helpers";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";
import {
  eachDayOfInterval,
  isToday,
  startOfMonth,
  startOfWeek,
  isSameMonth,
  format,
  subMonths,
  addMonths,
  addWeeks,
  subWeeks,
  isSameWeek,
} from "date-fns";
import {
  Calendar1,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Plus,
} from "lucide-react";
import { useMemo, useState } from "react";

const views = [
  {
    name: "Month",
    value: "month",
  },
  {
    name: "Week",
    value: "week",
  },
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function groupNotesByDate(
  notes: Note[],
  startDate: Date,
  endDate: Date,
  groupsFilter: Set<string>
) {
  const map = new Map<string, Note[]>();
  notes
    .filter(
      (note: Note) =>
        note.dueDate.toDate() >= startDate &&
        note.dueDate.toDate() <= endDate &&
        (groupsFilter.size === 0 || groupsFilter.has(note.groupId))
    )
    .forEach((note: Note) => {
      const dateKey = format(note.dueDate.toDate(), "yyyy-MM-dd");
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, note]);
    });
  return map;
}

const Calendar = () => {
  const { notes, groups } = useWorkspaceContext();
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [view, setView] = useState<"month" | "week">("month");
  const [groupsFilter, setGroupsFilter] = useState<Set<string>>(new Set());

  const { startDate, endDate } = useMemo(
    () => getDateRange(view, currentDate),
    [view, currentDate]
  );

  const days = useMemo(
    () => eachDayOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]
  );

  const notesByDate = useMemo(
    () => groupNotesByDate(notes, startDate, endDate, groupsFilter),
    [notes, startDate, endDate, groupsFilter]
  );
  return (
    <div className="flex-1 grid grid-rows-[4rem_1fr] mb-6">
      <div className=" flex justify-between">
        <div>
          <div className="flex justify-between items-center mb-4 gap-2">
            <Button
              variant={"outline"}
              onClick={() => {
                if (view === "month") {
                  setCurrentDate(subMonths(currentDate, 1));
                } else {
                  setCurrentDate(subWeeks(currentDate, 1));
                }
              }}
            >
              <ChevronLeft />
            </Button>
            <p className="text-xl w-40 text-center">
              {format(currentDate, "MMMM yyyy")}
            </p>
            <Button
              variant={"outline"}
              onClick={() => {
                if (view === "month") {
                  setCurrentDate(addMonths(currentDate, 1));
                } else {
                  setCurrentDate(addWeeks(currentDate, 1));
                }
              }}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 ">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"}>
                <CirclePlus className="h-4 w-4" />{" "}
                <span className="ml-2">groups</span>
                {groupsFilter.size > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />{" "}
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {groupsFilter.size}
                    </Badge>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder={`Filter group...`} />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {groups
                      .filter((group) => !group.isHidden)
                      .map((group) => {
                        const isSelected = groupsFilter.has(group.id);
                        return (
                          <CommandItem
                            key={group.id}
                            value={group.name}
                            onSelect={() => {
                              setGroupsFilter((prev) => {
                                const newSet = new Set(prev);
                                if (isSelected) {
                                  newSet.delete(group.id);
                                } else {
                                  newSet.add(group.id);
                                }
                                return newSet;
                              });
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={cn(
                                  "flex size-4 items-center justify-center",
                                  isSelected
                                    ? ""
                                    : "opacity-0 [&_svg]:invisible"
                                )}
                              >
                                <Check />
                              </div>

                              <span>{String(group.name)}</span>
                            </div>
                          </CommandItem>
                        );
                      })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Button
            variant={"outline"}
            disabled={
              (isSameMonth(currentDate, new Date()) && view === "month") ||
              (isSameWeek(currentDate, new Date(), { weekStartsOn: 1 }) &&
                view === "week")
            }
            onClick={() => {
              if (view === "month") {
                setCurrentDate(startOfMonth(new Date()));
              } else {
                setCurrentDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
              }
            }}
          >
            <Calendar1 />
            <span>This {view}</span>
          </Button>
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "month" | "week")}
          >
            <TabsList className=" bg-background gap-1 border">
              {views.map((view) => {
                return (
                  <TabsTrigger
                    key={view.value}
                    value={view.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {view.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          <Button>
            <Plus />
            <span>Add</span>
          </Button>
        </div>
      </div>
      {view === "month" && (
        <div className="grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="font-bold text-center">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const dayNotes = notesByDate.get(format(day, "yyyy-MM-dd")) || [];

            return (
              <div
                key={day.toString()}
                className={`p-2 aspect-square border rounded-md hover:cursor-pointer $ ${
                  !isSameMonth(day, currentDate) ? "opacity-30" : ""
                }`}
              >
                <p
                  className={`h-6 w-6 flex items-center justify-center text-sm font-bold mb-2 ${
                    isToday(day)
                      ? "bg-primary text-primary-foreground rounded-full"
                      : ""
                  }`}
                >
                  {format(day, "d")}
                </p>
                <div className="h-full overflow-y-auto hide-scrollbar">
                  {dayNotes.map((note) => {
                    const status = statuses.find(
                      (status) => status.value === note.status
                    );
                    return (
                      <div className="p-1 border rounded-sm text-[12px] ">
                        <p className="font-semibold truncate hover:overflow-visible hover:whitespace-normal ">
                          {note.content}
                        </p>
                        <p className="text-[10px] text-secondary-foreground">
                          {note.groupName}
                        </p>
                        <Badge variant="outline" className="text-[8px] px-1">
                          {status?.icon && <status.icon size={2} />}
                          <span>{status?.label}</span>
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {view === "week" && (
        <div className=" grid grid-cols-7 grid-rows-[auto_1fr] gap-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="h-6 font-bold text-center">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const dayNotes = notesByDate.get(format(day, "yyyy-MM-dd")) || [];
            return (
              <div className="flex flex-col justify-center items-center gap-2">
                <p
                  className={`h-6 w-6 flex items-center justify-center text-sm font-bold ${
                    isToday(day)
                      ? "bg-primary text-primary-foreground rounded-full"
                      : ""
                  }`}
                >
                  {format(day, "d")}
                </p>
                <div
                  key={day.toString()}
                  className={
                    "p-2 w-full h-full border rounded-md hover:cursor-pointer"
                  }
                >
                  <div className="h-full overflow-y-auto hide-scrollbar">
                    {dayNotes.map((note) => {
                      const status = statuses.find(
                        (status) => status.value === note.status
                      );
                      return (
                        <div className="p-1 border rounded-sm text-[12px] ">
                          <p className="font-semibold truncate hover:overflow-visible hover:whitespace-normal ">
                            {note.content}
                          </p>
                          <p className="text-[10px] text-secondary-foreground">
                            {note.groupName}
                          </p>
                          <Badge variant="outline" className="text-[8px] px-1">
                            {status?.icon && <status.icon size={2} />}
                            <span>{status?.label}</span>
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
