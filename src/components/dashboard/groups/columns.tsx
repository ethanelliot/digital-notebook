import type { ColumnDef } from "@tanstack/react-table";
import "@/types/table";

import type { Group } from "@/types/group";
import GroupsTableVisability from "./groups-table-visability";
import GroupsTableRowActions from "./groups-table-row-actions";

export const columns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableHiding: false,
    enableColumnFilter: true,
    meta: {
      headerClassName: "w-auto", // fixed width
      label: "name",
      placeholder: "Filter Groups...",
      variant: "text",
    },
  },
  {
    accessorKey: "isHidden",
    header: "Visability",
    enableColumnFilter: true,
    meta: {
      headerClassName: "w-30 text-center",
      cellClassName: "flex items-center justify-center",
      label: "Visability",
      variant: "select",
      options: [
        {
          label: "Hidden",
          value: true,
        },
        {
          label: "Visable",
          value: false,
        },
      ],
    },
    filterFn: (row, columnId, filterValue) => {
      // in the data-table-filter-select component we set the filter to a list even if there is only one element
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue[0] === row.getValue(columnId);
    },
    cell: ({ row }) => {
      const group = row.original;
      return <GroupsTableVisability group={group} />;
    },
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    meta: {
      headerClassName: "w-5",
    },
    cell: ({ row }) => {
      const group = row.original;

      return <GroupsTableRowActions group={group} />;
    },
  },
];
