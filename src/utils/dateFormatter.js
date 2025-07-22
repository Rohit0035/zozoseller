import { format, parseISO, isValid } from "date-fns";

const formatDate = dateStr => {
  if (!dateStr) return "N/A";
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, "d MMM yyyy") : "N/A";
};

const formatDateWithTime = dateStr => {
  if (!dateStr) return "N/A";
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, "d MMM yyyy HH:mm a") : "N/A";
};

export { formatDate, formatDateWithTime };
