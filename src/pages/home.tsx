import React from "react";
import { DataTable } from "@/components/dashboard/tasks/data-table";
import { columns } from "@/components/dashboard/tasks/columns";
import { testNotes } from "@/data/test-note-data";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto ">
      <DataTable columns={columns} data={testNotes} />
    </div>
  );
};

export default Home;
