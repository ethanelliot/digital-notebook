import React from "react";
import { DataTable } from "@/components/dashboard/notes/data-table";
import { columns } from "@/components/dashboard/notes/columns";

import { useNotesContext } from "@/contexts/notes-context";
import { DataTableSkeleton } from "./data-table-skeleton";

const NotesTable: React.FC = () => {
  const { notes } = useNotesContext();

  if (!notes) {
    return <DataTableSkeleton columnCount={5} rowCount={10} filterCount={3} />;
  }
  return <DataTable columns={columns} data={notes} />;
};

export default NotesTable;
