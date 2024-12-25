import { TextStyle, ViewStyle } from 'react-native';

export interface CsCardProps {
  title?: string;
  content?: string;
  footer?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: TextStyle;
  footerStyle?: ViewStyle;
  children?: React.ReactNode;
}
