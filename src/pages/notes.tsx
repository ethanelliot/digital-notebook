import React from "react";
import NotesTable from "@/components/dashboard/notes/notes-table";

const Notes: React.FC = () => {
  return (
    <div className="container mx-auto ">
      <p className="text-3xl font-bold mb-4">Notes</p>
      <NotesTable />
    </div>
  );
};

export default Notes;
