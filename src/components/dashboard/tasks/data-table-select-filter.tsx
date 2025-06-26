import { type Column } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, CirclePlus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DataTableSelectFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  multiple?: boolean;
}

export function DataTableSelectFilter<TData, TValue>({
  column,
  title,
  multiple = false,
}: DataTableSelectFilterProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const columnFilterValue = column.getFilterValue();
  const options = Array.from(column.getFacetedUniqueValues().keys());
  console.log(options);
  const selectedValues = useMemo(
    () => new Set(Array.isArray(columnFilterValue) ? columnFilterValue : []),
    [columnFilterValue]
  );

  const onItemSelect = useCallback(
    (optionValue: TValue, isSelected: boolean) => {
      if (!column) return;

      if (multiple) {
        const newSelectedValues = new Set(selectedValues);
        if (isSelected) {
          newSelectedValues.delete(optionValue);
        } else {
          newSelectedValues.add(optionValue);
        }
        const filterValues = Array.from(newSelectedValues);
        column.setFilterValue(filterValues.length ? filterValues : undefined);
      } else {
        column.setFilterValue(isSelected ? undefined : [optionValue]);
        setOpen(false);
      }
    },
    [column, multiple, selectedValues]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"}>
          <CirclePlus className="h-4 w-4" />{" "}
          <span className="ml-2">{title}</span>
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />{" "}
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      {/* The Command component is the missing piece! */}
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Filter ${title}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option);
                return (
                  <CommandItem
                    key={String(option)}
                    value={String(option)}
                    onSelect={() => onItemSelect(option, isSelected)}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center",
                          isSelected ? "" : "opacity-0 [&_svg]:invisible"
                        )}
                      >
                        <Check />
                      </div>

                      <span>{String(option)}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
