/**
 * Formats a full name by combining the first name and last name.
 *
 * @param {string} firstName - The first name of the person.
 * @param {string} lastName - The last name of the person.
 * @returns {string} The full name in the format "FirstName LastName".
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

/**
 * Formats initials from the given first name and optionally a last name.
 *
 * @param {string} firstName - The first name of the person.
 * @param {string} [lastName] - The optional last name of the person.
 * @returns {string} The initials in uppercase. If only the first name is provided, returns the initial of the first name. If only the last name is provided, returns the initial of the last name. If both are provided, returns the initials of both names.
 */
export function formatInitials(firstName: string, lastName?: string): string {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  if (firstName) return `${firstName.charAt(0)}`.toUpperCase();
  if (lastName) return `${lastName.charAt(0)}`.toUpperCase();
  return "";
}

/**
 * Formats a phone number into the standard (XXX) XXX-XXXX format.
 *
 * @param {string} phoneNumber - The phone number to format.
 * @returns {string} The formatted phone number. If the input cannot be formatted, returns the original phone number.
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

/**
 * Truncates a text to a specified maximum length, appending ellipsis if the text exceeds the maximum length.
 *
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum length of the text before truncation.
 * @returns {string} The truncated text, ending with "..." if it exceeds the maximum length. If the text is within the maximum length, returns the text unchanged.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
