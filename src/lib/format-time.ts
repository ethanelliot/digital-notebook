

export const formatTimeFromTimestamp = (date:Date|undefined) => {
  if (!date) {
    return '';
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
};