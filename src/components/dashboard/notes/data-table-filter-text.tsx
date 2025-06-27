import { Input } from "@/components/ui/input";
import { type Table } from "@tanstack/react-table";

interface DataTableTextFilterProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function DataTableTextFilter<TData>({
  table,
  className,
}: DataTableTextFilterProps<TData>) {
  return (
    <Input
      placeholder="Filter Notes"
      className={className}
      value={(table.getColumn("content")?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn("content")?.setFilterValue(event.target.value)
      }
    ></Input>
  );
}
