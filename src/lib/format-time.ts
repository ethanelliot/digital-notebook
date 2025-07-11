import { Timestamp } from 'firebase/firestore'

export const formatTimeFromTimestamp = (date: Date | undefined) => {
  if (!date) {
    return '23:59'
  }

  const hours = date.getHours()
  const minutes = date.getMinutes()

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}`
}

export function getEndOfDayTimestamp(date: Date): Timestamp {
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59)
  return Timestamp.fromDate(endOfDay)
}

export const getRelativeDate = (date: Date) => {
  const today = new Date()
  const targetDate = new Date(date)

  // Reset time to compare dates only
  today.setHours(0, 0, 0, 0)
  targetDate.setHours(0, 0, 0, 0)

  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  switch (diffDays) {
    case 0:
      return 'Today'
    case 1:
      return 'Tomorrow'
    case -1:
      return 'Yesterday'
    default:
      if (diffDays > 1 && diffDays <= 7) {
        return targetDate.toLocaleDateString('en-US', { weekday: 'long' })
      } else {
        return targetDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
        })
      }
  }
}
