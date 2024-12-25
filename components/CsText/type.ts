import { TextProps, TextStyle } from 'react-native';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'overline';
export type TextColor = 'primary' | 'secondary' | 'error' | 'light';

export interface CsTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  style?: TextStyle;
}
