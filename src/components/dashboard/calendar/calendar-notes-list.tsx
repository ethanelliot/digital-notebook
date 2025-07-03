import { Badge } from "@/components/ui/badge";
import { statuses } from "@/lib/constants";
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
            className="p-1 border rounded-sm text-[12px] mb-1 cursor-pointer"
            key={note.id}
            onClick={() => onNotesClicked?.(note)}
          >
            <p className="font-semibold truncate hover:overflow-visible hover:whitespace-normal">
              {note.content}
            </p>
            <p className="text-[10px] text-secondary-foreground">
              {note.groupName}
            </p>
            <Badge variant="outline" className="text-[8px] px-1 hidden sm:flex">
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
