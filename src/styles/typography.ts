import { TextStyle } from 'react-native';
import { fonts } from './fonts';

/**
 * Defines the typography styles for the application.
 * This object contains various text styles that can be used throughout the app
 * to maintain consistency in text appearance.
 */
export const typography: { [key: string]: TextStyle } = {
  h1: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0.25,
  },
  h2: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  h3: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  h4: {
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  button: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
  overline: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};

/**
 * Helper function to create a new text style with modified properties.
 * @param baseStyle - The base style to modify.
 * @param modifications - An object containing the properties to change or add.
 * @returns A new TextStyle object with the applied modifications.
 */
export const createTextStyle = (baseStyle: TextStyle, modifications: Partial<TextStyle>): TextStyle => {
  return { ...baseStyle, ...modifications };
};

/**
 * Examples of using the createTextStyle function to create variants:
 */
export const typographyVariants = {
  h1Light: createTextStyle(typography.h1, { fontFamily: fonts.regular }),
  bodyBold: createTextStyle(typography.body, { fontFamily: fonts.bold }),
  captionMedium: createTextStyle(typography.caption, { fontFamily: fonts.medium }),
  // Add more variants as needed
};
