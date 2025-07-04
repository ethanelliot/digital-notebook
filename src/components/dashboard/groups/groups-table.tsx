import React from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "@/components/dashboard/groups/columns";

import { useWorkspaceContext } from "@/contexts/workspace-context";
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton";
import { useDialog } from "@/contexts/dialog-context";

const GroupsTable: React.FC = () => {
  const { loading, groups } = useWorkspaceContext();
  const { openDialog } = useDialog();

  if (groups.length === 0 && loading) {
    return <DataTableSkeleton columnCount={5} rowCount={10} filterCount={3} />;
  }
  return (
    <>
      <DataTable
        columns={columns}
        data={groups}
        onAdd={() => openDialog("groupForm", {})}
      />
    </>
  );
};

export default GroupsTable;
