import { type Table } from "@tanstack/react-table";
import { DataTableTextFilter } from "./data-table-filter-text";
import { DataTableSelectFilter } from "./data-table-filter-select";
import { statuses } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2, Plus } from "lucide-react";
import { NoteFormDialog } from "../dialog/note-form-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [openNewNote, setOpenNewNote] = useState(false);

  const statusColumn = table.getColumn("status");
  const groupColumn = table.getColumn("group");

  return (
    <div className="flex justfiy justify-between pb-2 gap-2">
      <div className="w-full flex gap-2 flex-wrap sm:flex-nowrap">
        <DataTableTextFilter table={table} className={"sm:w-64 w-full"} />
        <div className="w-full flex gap-2 gap-y-2">
          {statusColumn && (
            <DataTableSelectFilter
              column={statusColumn}
              title="Status"
              possibleValues={statuses.map((value) => value.value)}
            />
          )}
          {groupColumn && (
            <DataTableSelectFilter
              column={groupColumn}
              title="Group"
              multiple={true}
            />
          )}
        </div>
      </div>

      <div className="flex gap-2 gap-y-2 flex-col sm:flex-row">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings2 /> <span className="hidden md:block">View</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={() => setOpenNewNote(true)}>
          <Plus />
          <span className="sm:block hidden">New</span>
        </Button>

        <NoteFormDialog open={openNewNote} onOpenChange={setOpenNewNote} />
      </div>
    </div>
  );
}
