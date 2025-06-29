import { Input } from "@/components/ui/input";
import { type Table } from "@tanstack/react-table";

interface DataTableTextFilterProps<TData> {
  table: Table<TData>;
  column: string;
  className?: string;
  placeholder?: string;
}

export function DataTableTextFilter<TData>({
  table,
  column,
  className,
  placeholder,
}: DataTableTextFilterProps<TData>) {
  return (
    <Input
      placeholder={placeholder}
      className={className}
      value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(column)?.setFilterValue(event.target.value)
      }
    ></Input>
  );
}
