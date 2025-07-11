import { type Table } from "@tanstack/react-table";
import { DataTableTextFilter } from "./data-table-filter-text";
import { DataTableSelectFilter } from "./data-table-filter-select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onAdd?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  onAdd,
}: DataTableToolbarProps<TData>) {
  const columns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

  return (
    <div className="flex justfiy justify-between pb-2 gap-2">
      <div className="w-full flex gap-2 flex-wrap sm:flex-nowrap">
        {columns.map((column) => {
          const columnMeta = column.columnDef.meta;

          switch (columnMeta?.variant) {
            case "text":
              return (
                <DataTableTextFilter
                  table={table}
                  column={column.id}
                  placeholder={columnMeta?.placeholder}
                  className={"sm:w-64 w-full"}
                />
              );
              break;
            case "select":
              return (
                <DataTableSelectFilter
                  column={column}
                  title={columnMeta?.label ?? ""}
                  possibleValues={columnMeta?.options}
                />
              );

            case "multiSelect":
              return (
                <DataTableSelectFilter
                  column={column}
                  title={columnMeta?.label ?? ""}
                  possibleValues={columnMeta?.options}
                  multiple={true}
                />
              );

            default:
              break;
          }
        })}
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
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus />
            <span className="sm:block hidden">New</span>
          </Button>
        )}
      </div>
    </div>
  );
}
