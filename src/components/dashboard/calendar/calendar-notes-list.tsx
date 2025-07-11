import { Badge } from "@/components/ui/badge";
import { groupColors, statuses } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";
import type { CalendarView } from "./calendar";
interface CalendarNotesListProps {
  notes: Note[];
  onNoteClick?: (note: Note) => void;
  view?: CalendarView;
}

const CalendarNotesList = ({
  notes,
  onNoteClick,
  view = "month",
}: CalendarNotesListProps) => {
  return (
    <>
      {notes.map((note) => {
        const status = statuses.find((status) => status.value === note.status);
        return (
          <div
            className={cn(
              "p-1 sm:h-auto rounded-sm text-[12px] mb-1 cursor-pointer",
              view === "month" ? "h-2 " : "", // Todo: Find a way to make this not so hard coded inside component
              groupColors[note.groupColor].background,
              groupColors[note.groupColor].text
            )}
            key={note.id}
            onClick={() => onNoteClick?.(note)}
          >
            <div className={view === "month" ? "hidden sm:block" : ""}>
              <p className="font-semibold truncate hover:overflow-visible hover:whitespace-normal">
                {note.content}
              </p>
              <p className="text-[10px]">{note.groupName}</p>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8px] px-1 hidden sm:flex",
                  groupColors[note.groupColor].text,
                  groupColors[note.groupColor].border
                )}
              >
                {status?.icon && <status.icon size={2} />}
                <span>{status?.label}</span>
              </Badge>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CalendarNotesList;
