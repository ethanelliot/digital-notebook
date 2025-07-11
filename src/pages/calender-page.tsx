import Calendar, {
  CalendarSkeleton,
} from '@/components/dashboard/calendar/calendar'
import { useWorkspaceContext } from '@/contexts/workspace-context'
import React from 'react'

const CalendarPage: React.FC = () => {
  const { loading } = useWorkspaceContext()

  return (
    <div className="container mx-auto h-full flex flex-col">
      <p className="text-3xl font-bold mb-4">Calendar</p>
      <div className="flex flex-1">
        {loading ? <CalendarSkeleton /> : <Calendar />}
      </div>
    </div>
  )
}

export default CalendarPage
