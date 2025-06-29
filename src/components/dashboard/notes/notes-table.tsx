import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "@/components/dashboard/notes/columns";

import { useDashboardContext } from "@/contexts/dashboard-context";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton";
import { NoteFormDialog } from "../dialog/note-form-dialog";

const NotesTable: React.FC = () => {
  const { loading, notes } = useDashboardContext();
  const [openNewNote, setOpenNewNote] = useState(false);

  if (notes.length === 0 && loading) {
    return <DataTableSkeleton columnCount={5} rowCount={10} filterCount={3} />;
  }
  return (
    <>
      <NoteFormDialog open={openNewNote} onOpenChange={setOpenNewNote} />
      <DataTable
        columns={columns}
        data={notes}
        onAdd={() => setOpenNewNote(true)}
      />
    </>
  );
};

export default NotesTable;
