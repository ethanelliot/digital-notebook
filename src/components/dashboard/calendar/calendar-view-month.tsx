import React from "react";
import { daysOfWeek } from "@/lib/constants";
import { isToday, format, isSameMonth } from "date-fns";
import type { Note } from "@/types/note";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalendarNotesList from "./calendar-notes-list";
import { useDialog } from "@/contexts/dialog-context";
import type { CalendarView } from "./calendar";
import { useIsMobile } from "@/hooks/use-mobile";

type CalendarMonthViewProps = {
  days: Date[];
  notesByDate: Map<string, Note[]>;
  onCellAction: (day: Date) => void;
  onCellClick?: (day: Date) => void;
};

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  days,
  notesByDate,
  onCellAction,
  onCellClick,
}) => {
  const isMobile = useIsMobile();
  const { openDialog } = useDialog();
  const view: CalendarView = "month";

  // The middle day is going to be of the correct month
  const month = days[Math.floor(days.length / 2)];

  return (
    <div
      className={`flex-1 sm:gap-2 grid grid-cols-7  ${
        Math.floor(days.length / 7) == 5
          ? "grid-rows-[2em_repeat(5,1fr)]"
          : "grid-rows-[2em_repeat(6,1fr)]"
      }`}
    >
      {daysOfWeek.map((day) => (
        <div key={day} className="font-bold text-center h-2">
          {day}
        </div>
      ))}
      {days.map((day) => {
        const dayNotes = notesByDate.get(format(day, "yyyy-MM-dd")) || [];

        return (
          <div
            key={day.toString()}
            onClick={() => onCellClick?.(day)}
            className={`min-h-0 sm:aspect-square border sm:rounded-md ${
              !isSameMonth(day, month) ? "opacity-30" : ""
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
                    onCellAction(day);
                  }}
                >
                  <Plus />
                </Button>
              </div>
              <div className="flex-1 p-1 sm:p-2 overflow-y-auto hide-scrollbar">
                <CalendarNotesList
                  onNoteClick={(note: Note) => {
                    if (!isMobile) {
                      openDialog("noteForm", {
                        note: note,
                      });
                    }
                  }}
                  notes={dayNotes}
                  view={view}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarMonthView;
