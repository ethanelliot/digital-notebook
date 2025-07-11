import React from 'react'
import GroupsTable from '@/components/dashboard/groups/groups-table'

const GroupsPage: React.FC = () => {
  return (
    <div className="container mx-auto ">
      <p className="text-3xl font-bold mb-4">Groups</p>
      <GroupsTable />
    </div>
  )
}

export default GroupsPage
