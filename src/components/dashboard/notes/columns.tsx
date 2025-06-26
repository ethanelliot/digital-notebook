import type { ColumnDef } from "@tanstack/react-table";
import type { Note } from "@/types/Note";
import type { Timestamp } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Clock, MoreHorizontal, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "./data-table-column-header";
import DataTableRowActions from "./data-table-row-actions";

export const columns: ColumnDef<Note>[] = [
  {
    accessorKey: "content",
    header: "Content",
  },
  {
    accessorKey: "status",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status: "In-progress" | "Completed" | "Not-started" =
        row.getValue("status");

      return (
        <Badge variant="outline">
          {
            {
              Completed: (
                <>
                  <CircleCheck />
                  <span>Completed</span>
                </>
              ),
              "In-progress": (
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
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const dueDateValue: Timestamp = row.getValue("dueDate");
      const date = dueDateValue.toDate();
      const formatted = date.toLocaleDateString();
      return <div>{formatted}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const dateA: Timestamp = rowA.getValue("dueDate");
      const dateB: Timestamp = rowB.getValue("dueDate");
      console.log("sorting");

      // Compare the timestamps' toMillis() value for accurate sorting
      return dateA.toMillis() - dateB.toMillis();
    },
  },
  {
    accessorKey: "group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group" />
    ),
    filterFn: (row, id, value) => {
      // value is an array of selected options
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const note = row.original;

      return <DataTableRowActions note={note} />;
    },
  },
];
