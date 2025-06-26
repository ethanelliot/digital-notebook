import { Input } from "@/components/ui/input";
import { type Table } from "@tanstack/react-table";

interface DataTableTextFilterProps<TData> {
  table: Table<TData>;
}

export function DataTableTextFilter<TData>({
  table,
}: DataTableTextFilterProps<TData>) {
  return (
    <Input
      placeholder="Filter Notes"
      className="w-64"
      value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn("name")?.setFilterValue(event.target.value)
      }
    ></Input>
  );
}
