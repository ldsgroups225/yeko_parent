import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (
  date: Date | string,
  formatString: string = "EEEE dd MMMM"
): string => {
  return format(date, formatString, { locale: fr });
};

export const formatTime = (
  date: Date,
  formatString: string = "HH:mm"
): string => {
  return format(date, formatString, { locale: fr });
};
