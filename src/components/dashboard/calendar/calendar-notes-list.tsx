import { Badge } from "@/components/ui/badge";
import { groupColors, statuses } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";
type CalendarNotesListProps = {
  notes: Note[];
  onNotesClicked?: (note: Note) => void;
};

const CalendarNotesList = ({
  notes,
  onNotesClicked,
}: CalendarNotesListProps) => {
  return (
    <>
      {notes.map((note) => {
        const status = statuses.find((status) => status.value === note.status);
        return (
          <div
            className={cn(
              "p-1 rounded-sm text-[12px] mb-1 cursor-pointer",
              groupColors[note.groupColor].background,
              groupColors[note.groupColor].text
            )}
            key={note.id}
            onClick={() => onNotesClicked?.(note)}
          >
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
        );
      })}
    </>
  );
};

export default CalendarNotesList;
