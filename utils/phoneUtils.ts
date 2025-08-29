/**
 * @fileoverview Utility functions for normalizing Côte d'Ivoire phone numbers
 * Removes country codes and standardizes format for database matching
 * @author Yeko Team
 * @version 1.0.0
 */

/**
 * Normalizes a Côte d'Ivoire phone number by removing country code and formatting
 * Supports various input formats including +225, 00225 prefixes
 * Minimum length requirement of 10 digits to avoid special numbers
 * 
 * @param phoneNumber - The phone number string to normalize
 * @returns The normalized 10-digit phone number or null if invalid
 * 
 * @example
 * normalizeCIPhoneNumber('+225 07 01 02 03 04') // returns '0701020304'
 * normalizeCIPhoneNumber('00225-05-11-22-33-44') // returns '0511223344'
 * normalizeCIPhoneNumber('0701020304') // returns '0701020304'
 * normalizeCIPhoneNumber('123') // returns null (too short)
 */
export function normalizeCIPhoneNumber(phoneNumber: string): string | null {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return null;
  }

  // Clean the input: remove spaces, dashes, parentheses
  let cleanedNumber = phoneNumber.trim().replace(/[\s\-\(\)]/g, '');

  // Remove country code prefixes
  if (cleanedNumber.startsWith('+225')) {
    cleanedNumber = cleanedNumber.substring(4);
  } else if (cleanedNumber.startsWith('00225')) {
    cleanedNumber = cleanedNumber.substring(5);
  } else if (cleanedNumber.startsWith('225') && cleanedNumber.length === 13) {
    // Handle cases like '2250701020304'
    cleanedNumber = cleanedNumber.substring(3);
  }

  // Validate: only digits allowed
  if (!/^\d+$/.test(cleanedNumber)) {
    return null;
  }

  // Validate: minimum 10 digits to avoid special numbers
  if (cleanedNumber.length < 10) {
    return null;
  }

  // For numbers longer than 10 digits, take the last 10
  if (cleanedNumber.length > 10) {
    cleanedNumber = cleanedNumber.slice(-10);
  }

  // Validate: must start with valid service indicators (0, 2 for mobile/fixed)
  const firstDigit = cleanedNumber.charAt(0);
  if (!['0', '2'].includes(firstDigit)) {
    return null;
  }

  return cleanedNumber;
}

/**
 * Checks if a phone number is a valid Côte d'Ivoire mobile number
 * Mobile numbers start with 0 and are 10 digits long
 * 
 * @param phoneNumber - The phone number to validate
 * @returns True if it's a valid mobile number
 */
export function isCIMobileNumber(phoneNumber: string): boolean {
  const normalized = normalizeCIPhoneNumber(phoneNumber);
  return normalized !== null && normalized.startsWith('0') && normalized.length === 10;
}

/**
 * Checks if a phone number is a valid Côte d'Ivoire fixed-line number
 * Fixed-line numbers start with 2 and are 10 digits long
 * 
 * @param phoneNumber - The phone number to validate
 * @returns True if it's a valid fixed-line number
 */
export function isCIFixedLineNumber(phoneNumber: string): boolean {
  const normalized = normalizeCIPhoneNumber(phoneNumber);
  return normalized !== null && normalized.startsWith('2') && normalized.length === 10;
}

/**
 * Formats a normalized phone number for display
 * Adds spaces for better readability
 * 
 * @param phoneNumber - The normalized 10-digit phone number
 * @returns Formatted phone number string
 * 
 * @example
 * formatCIPhoneNumber('0701020304') // returns '07 01 02 03 04'
 */
export function formatCIPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber || phoneNumber.length !== 10) {
    return phoneNumber;
  }

  return `${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 4)} ${phoneNumber.slice(4, 6)} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(8, 10)}`;
}
