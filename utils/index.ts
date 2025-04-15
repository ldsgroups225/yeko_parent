import { calculateAverage } from "./calculateAverage";
import { formatDate } from "./formatDate";
import { formatNote } from "./formatNote";
import { groupBy } from "./groupBy";
import { truncateText } from "./truncateText";
import { manipulateColor } from "./manipulateColor";
import * as caseConverter from "./caseConverter";
import * as formatting from "./formatting";
import * as validate from "./validators";

export {
  calculateAverage,
  formatDate,
  formatNote,
  groupBy,
  truncateText,
  formatting,
  caseConverter,
  validate,
  manipulateColor,
};

/**
 * Format a number as currency in FCFA
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
