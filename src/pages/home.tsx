import React from "react";
import NotesTable from "@/components/dashboard/notes/notes-table";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto ">
      <NotesTable />
    </div>
  );
};

export default Home;
