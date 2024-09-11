import { TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { ITheme } from './theme';

declare global {
  type Theme = ITheme;

  type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

  type StylesOf<T extends NamedStyles<T> | NamedStyles<any>> = {
    [P in keyof T]: T[P] extends ViewStyle | TextStyle | ImageStyle
      ? T[P]
      : StylesOf<T[P]>;
  };

  interface StyleSheetType {
    create<T extends NamedStyles<T> | NamedStyles<any>>(styles: T | NamedStyles<T>): StylesOf<T>;
  }
}
