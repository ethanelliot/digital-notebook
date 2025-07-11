import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns'

export function getDateRange(view: 'month' | 'week', currentDate: Date) {
  if (view === 'month') {
    return {
      startDate: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
      endDate: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
    }
  }
  return {
    startDate: startOfWeek(currentDate, { weekStartsOn: 1 }),
    endDate: endOfWeek(currentDate, { weekStartsOn: 1 }),
  }
}
