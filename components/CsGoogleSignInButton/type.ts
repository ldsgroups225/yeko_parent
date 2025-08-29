import { ViewStyle, TextStyle } from 'react-native';

export type GoogleSignInMode = 'signin' | 'signup';
export type GoogleButtonSize = 'small' | 'medium' | 'large';

export interface CsGoogleSignInButtonProps {
  onPress?: () => void;
  mode?: GoogleSignInMode;
  size?: GoogleButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onAuthAttempt?: (success: boolean) => void;
}
