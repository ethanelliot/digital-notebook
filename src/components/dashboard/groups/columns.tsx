import type { ColumnDef } from '@tanstack/react-table'
import '@/types/table'

import type { Group } from '@/types/group'
import GroupsTableVisability from './groups-table-visability'
import GroupsTableRowActions from './groups-table-row-actions'
import { cn } from '@/lib/utils'
import { groupColors } from '@/lib/constants'

export const columns: ColumnDef<Group>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableHiding: false,
    enableColumnFilter: true,
    meta: {
      headerClassName: 'w-auto', // fixed width
      label: 'name',
      placeholder: 'Filter Groups...',
      variant: 'text',
    },
  },
  {
    accessorKey: 'color',
    header: 'Color',
    enableHiding: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const group = row.original
      return (
        <div className="flex items-center justify-center">
          <div
            className={cn(
              'h-4 w-4 rounded-full',
              groupColors[group.color].background
            )}
          ></div>
        </div>
      )
    },
    meta: {
      headerClassName: 'w-30 text-center',
    },
  },
  {
    accessorKey: 'isHidden',
    header: 'Visability',
    enableColumnFilter: true,
    meta: {
      headerClassName: 'w-30 text-center',
      cellClassName: 'flex items-center justify-center',
      label: 'Visability',
      variant: 'select',
      options: [
        {
          label: 'Hidden',
          value: true,
        },
        {
          label: 'Visable',
          value: false,
        },
      ],
    },
    filterFn: (row, id, value) => {
      // in the data-table-filter-select component we set the filter to a list even if there is only one element
      const filterValue = String(value)

      if (!filterValue || filterValue.length === 0) return true
      return filterValue.startsWith(row.getValue(id))
    },
    cell: ({ row }) => {
      const group = row.original
      return <GroupsTableVisability group={group} />
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    meta: {
      headerClassName: 'w-5',
    },
    cell: ({ row }) => {
      const group = row.original

      return <GroupsTableRowActions group={group} />
    },
  },
]
