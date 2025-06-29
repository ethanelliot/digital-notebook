import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "@/components/dashboard/groups/columns";

import { useDashboardContext } from "@/contexts/dashboard-context";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton";
import GroupFormDialog from "../dialog/group-form-dialog";

const GroupsTable: React.FC = () => {
  const { loading, groups } = useDashboardContext();
  const [openNewGroup, setOpenNewGroup] = useState(false);

  if (groups.length === 0 && loading) {
    return <DataTableSkeleton columnCount={5} rowCount={10} filterCount={3} />;
  }
  return (
    <>
      <GroupFormDialog open={openNewGroup} onOpenChange={setOpenNewGroup} />
      <DataTable
        columns={columns}
        data={groups}
        onAdd={() => setOpenNewGroup(true)}
      />
    </>
  );
};

export default GroupsTable;
