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
import { groupColors } from "@/lib/constants";
import { useDialog } from "@/contexts/dialog-context";
import { getEndOfDayTimestamp } from "@/lib/format-time";
import { useIsMobile } from "@/hooks/use-mobile";
import CalendarDrawer from "./calendar-drawer";
import CalendarWeekView from "./calendar-view-week";
import CalendarMonthView from "./calendar-view-month";

export type CalendarView = "month" | "week";

const calendarViews = [
  {
    name: "Month",
    value: "month",
  },
  {
    name: "Week",
    value: "week",
  },
];

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
  const { openDialog } = useDialog();
  const isMobile = useIsMobile();

  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [view, setView] = useState<CalendarView>("month");
  const [groupsFilter, setGroupsFilter] = useState<Set<string>>(new Set());
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

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

                              <span className="flex gap-1 items-center">
                                <div
                                  className={cn(
                                    "h-4 w-4 rounded-full",
                                    groupColors[group.color].background
                                  )}
                                ></div>
                                {String(group.name)}
                              </span>
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
            onValueChange={(value) => setView(value as CalendarView)}
          >
            <TabsList className=" bg-background gap-1 border">
              {calendarViews.map((view) => {
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
        <Button
          onClick={() => openDialog("noteForm", {})}
          className="flex-shrink-0"
        >
          <Plus />
          <span className="hidden sm:block">Add</span>
        </Button>
      </div>
      {view === "month" && (
        <CalendarMonthView
          days={days}
          notesByDate={notesByDate}
          onCellClick={(day: Date) => {
            if (isMobile) {
              setCurrentDate(day);
              setOpenDrawer(true);
            }
          }}
          onCellAction={(day: Date) => {
            if (!isMobile) {
              setCurrentDate(day);
              openDialog("noteForm", {
                defaultValues: {
                  dueDate: getEndOfDayTimestamp(currentDate),
                },
              });
            }
          }}
        />
      )}
      {view === "week" && (
        <CalendarWeekView
          days={days}
          notesByDate={notesByDate}
          onCellAction={(day: Date) => {
            setCurrentDate(day);
            openDialog("noteForm", {
              defaultValues: {
                dueDate: getEndOfDayTimestamp(currentDate),
              },
            });
          }}
        />
      )}

      {isMobile && (
        <CalendarDrawer
          open={openDrawer}
          setIsOpen={setOpenDrawer}
          notes={notesByDate.get(format(currentDate, "yyyy-MM-dd")) || []}
          date={currentDate}
        />
      )}
    </div>
  );
};

export default Calendar;
