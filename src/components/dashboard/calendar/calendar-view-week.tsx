import React from "react";
import { daysOfWeek } from "@/lib/constants";
import { isToday, format } from "date-fns";
import type { Note } from "@/types/note";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalendarNotesList from "./calendar-notes-list";
import { useDialog } from "@/contexts/dialog-context";
import type { CalendarView } from "./calendar";

type CalendarWeekViewProps = {
  days: Date[];
  notesByDate: Map<string, Note[]>;
  onCellAction: (day: Date) => void;
  onCellClick?: () => void;
};

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  days,
  notesByDate,
  onCellAction,
  onCellClick,
}) => {
  const { openDialog } = useDialog();
  const view: CalendarView = "week";
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr] sm:gap-2">
      {daysOfWeek.map((day) => (
        <div key={day} className="h-6 font-bold text-center">
          {day}
        </div>
      ))}
      {days.map((day) => {
        const dayNotes = notesByDate.get(format(day, "yyyy-MM-dd")) || [];
        return (
          <div
            className="flex flex-col justify-center items-center sm:gap-2 gap-y-2"
            onClick={onCellClick}
          >
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
              className={"sm:p-2 w-full h-full border sm:rounded-md "}
            >
              <div className="h-full overflow-y-auto hide-scrollbar">
                <div className="w-full flex justify-end mb-2">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="h-6 w-6 md:flex hidden"
                    onClick={() => onCellAction(day)}
                  >
                    <Plus />
                  </Button>
                </div>
                <CalendarNotesList
                  onNoteClick={(note: Note) => {
                    openDialog("noteForm", {
                      note: note,
                    });
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

export default CalendarWeekView;
