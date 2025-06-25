import type { ColumnDef } from "@tanstack/react-table";
import type { Note } from "@/types/Note";
import type { Timestamp } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Clock, MoreHorizontal, RefreshCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Note>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: "In-progress" | "Completed" | "Not-started" =
        row.getValue("status");

      return (
        <Badge variant="outline">
          {
            {
              "In-progress": (
                <>
                  <CircleCheck />
                  <span>Completed</span>
                </>
              ),
              Completed: (
                <>
                  <RefreshCcw />
                  <span>In progress</span>
                </>
              ),
              "Not-started": (
                <>
                  <Clock />
                  <span>Not started</span>
                </>
              ),
            }[status]
          }
        </Badge>
      );
    },
  },

  {
    accessorKey: "dueDate",
    header: "Due date",
    cell: ({ row }) => {
      const dueDateValue: Timestamp = row.getValue("dueDate");
      const date = dueDateValue.toDate();
      const formatted = date.toLocaleDateString();
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "group",
    header: "Group",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const note = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log(note.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Copy</DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Set Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <CircleCheck />
                  <span>Completed</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCcw />
                  <span>In progress</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock />
                  <span>Not started</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
