import React from "react";
import { DataTable } from "@/components/dashboard/notes/data-table";
import { columns } from "@/components/dashboard/notes/columns";
import { testNotes } from "@/data/test-note-data";
import NotesTable from "@/components/dashboard/notes/notes-table";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto ">
      <NotesTable />
    </div>
  );
};

export default Home;
