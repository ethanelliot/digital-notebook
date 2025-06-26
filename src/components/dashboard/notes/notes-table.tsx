import React from "react";
import { DataTable } from "@/components/dashboard/notes/data-table";
import { columns } from "@/components/dashboard/notes/columns";
import { useNotesContext } from "@/contexts/notes-context";

const NotesTable: React.FC = () => {
  const { notes } = useNotesContext();

  if (!notes) {
    return <></>;
  }
  return <DataTable columns={columns} data={notes} />;
};

export default NotesTable;
