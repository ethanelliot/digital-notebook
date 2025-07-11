import React from 'react'
import { columns } from '@/components/dashboard/notes/columns'
import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { useDialog } from '@/contexts/dialog-context'
import { useWorkspaceContext } from '@/contexts/workspace-context'

const NotesTable: React.FC = () => {
  const { loading, notes } = useWorkspaceContext()
  const { openDialog } = useDialog()

  if (notes.length === 0 && loading) {
    return <DataTableSkeleton columnCount={5} rowCount={10} filterCount={3} />
  }
  return (
    <>
      <DataTable
        columns={columns}
        data={notes}
        onAdd={() => openDialog('noteForm', {})}
      />
    </>
  )
}

export default NotesTable
