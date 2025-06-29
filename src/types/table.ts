export interface FilterOption {
  label: string;
  value: unknown;
}

declare module "@tanstack/react-table" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: "text" | "select" | "multiSelect";
    options?:FilterOption[];
    headerClassName?: string;
    cellClassName?: string;
  }
}