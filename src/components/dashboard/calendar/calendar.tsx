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
import CalendarNotesList from "./calendar-notes-list";
import { NoteFormDialog } from "../dialog/note-form-dialog";
import { getEndOfDayTimestamp } from "@/lib/format-time";

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
  const [openNoteForm, setOpenNoteForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

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
    <div className="flex-1 grid grid-rows-[auto_1fr] mb-4">
      <div className="flex flex-wrap justify-between mb-2 gap-2">
        <div className="flex justify-between items-center gap-2 flex-shrink-0">
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
          <p className="text-xl w-32 text-center">
            {format(currentDate, "MMM yyyy")}
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
        <div className="flex flex-grow gap-2 order-last lg:order-none w-full md:w-auto justify-center md:justify-end ">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"}>
                <CirclePlus className="h-4 w-4" />
                <span className="ml-2">groups</span>
                {groupsFilter.size > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
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
            <span className="hidden sm:block">This {view}</span>
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
        </div>
        <Button onClick={() => setOpenNoteForm(true)} className="flex-shrink-0">
          <Plus />
          <span className="hidden sm:block">Add</span>
        </Button>
      </div>
      {view === "month" && (
        <div
          className={`flex-1 sm:gap-2 grid grid-cols-7  ${
            Math.floor(days.length / 7) == 5
              ? "grid-rows-[2em_repeat(5,1fr)]"
              : "grid-rows-[2em_repeat(6,1fr)]"
          }`}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="font-bold text-center h-2">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const dayNotes = notesByDate.get(format(day, "yyyy-MM-dd")) || [];

            return (
              <div
                key={day.toString()}
                className={`min-h-0 sm:aspect-square border sm:rounded-md  $ ${
                  !isSameMonth(day, currentDate) ? "opacity-30" : ""
                }`}
              >
                <div className="flex flex-col w-full h-full ">
                  <div className="flex justify-between w-full sm:p-1">
                    <p
                      className={`h-6 w-6 flex items-center justify-center text-sm font-bold ${
                        isToday(day)
                          ? "bg-primary text-primary-foreground md:rounded-full rounded-br-md"
                          : ""
                      }`}
                    >
                      {format(day, "d")}
                    </p>

                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="h-6 w-6 md:flex hidden"
                      onClick={() => {
                        setCurrentDate(day);
                        setOpenNoteForm(true);
                      }}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <div className="flex-1 sm:p-2 overflow-y-auto hide-scrollbar">
                    <CalendarNotesList
                      onNotesClicked={(note: Note) => {
                        setSelectedNote(note);
                        setOpenNoteForm(true);
                      }}
                      notes={dayNotes}
                    />
                  </div>
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
                  className={`h-6 w-6 flex items-center justify-center text-sm font-bold  ${
                    isToday(day)
                      ? "bg-primary text-primary-foreground rounded-full"
                      : ""
                  }`}
                >
                  {format(day, "d")}
                </p>

                <div
                  key={day.toString()}
                  className={"p-2 w-full h-full border rounded-md "}
                >
                  <div className="h-full overflow-y-auto hide-scrollbar">
                    <div className="w-full flex justify-end mb-2">
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="h-6 w-6 md:flex hidden"
                        onClick={() => {
                          setCurrentDate(day);
                          setOpenNoteForm(true);
                        }}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <CalendarNotesList
                      onNotesClicked={(note: Note) => {
                        setSelectedNote(note);
                        setOpenNoteForm(true);
                      }}
                      notes={dayNotes}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NoteFormDialog */}

      <NoteFormDialog
        open={openNoteForm}
        onOpenChange={(open: boolean) => {
          if (open === false) {
            setOpenNoteForm(false);
            setSelectedNote(null);
          } else {
            setOpenNoteForm(true);
          }
        }}
        note={selectedNote ?? undefined}
        defaultValues={{
          dueDate: getEndOfDayTimestamp(currentDate),
        }}
      />
    </div>
  );
};

export default Calendar;
