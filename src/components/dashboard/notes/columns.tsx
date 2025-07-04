import type { ColumnDef } from "@tanstack/react-table";
import "@/types/table";
import type { Note, statusType } from "@/types/note";
import type { Timestamp } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { groupColors, statuses } from "@/lib/constants";
import NotesTableRowActions from "./notes-table-row-actions";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<Note>[] = [
  {
    accessorKey: "content",
    header: "Content",
    enableHiding: false,
    meta: {
      label: "Content",
      placeholder: "Filter Notes...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "status",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const s: statusType = row.getValue("status");

      const status = statuses.find((status) => status.value === s);

      return (
        <Badge variant="outline">
          {status?.icon && <status.icon />}
          <span>{status?.label}</span>
        </Badge>
      );
    },

    meta: {
      label: "Status",
      variant: "select",
      options: statuses.map((status) => ({
        label: status.label,
        value: status.value,
      })),
    },
    size: 20,
    enableColumnFilter: true,
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

      // Compare the timestamps' toMillis() value for accurate sorting
      return dateA.toMillis() - dateB.toMillis();
    },
    size: 20,
  },
  {
    accessorKey: "groupName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group" />
    ),
    cell: ({ row }) => {
      return (
        <span className="flex gap-1 items-center">
          <div
            className={cn(
              "h-4 w-4 rounded-full",
              groupColors[row.original.groupColor].background
            )}
          ></div>
          {String(row.getValue("groupName"))}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      // value is an array of selected options
      return value.includes(row.getValue(id));
    },
    meta: {
      label: "Group",
      variant: "multiSelect",
    },
    enableColumnFilter: true,
    size: 10,
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const note = row.original;

      return <NotesTableRowActions note={note} />;
    },
    meta: {
      headerClassName: "w-5",
    },
  },
];
