import { TextStyle } from 'react-native';

export const fonts = {
  regular: 'Roboto_400Regular',
  medium: 'Roboto_500Medium',
  bold: 'Roboto_700Bold',
};

export const createRobotoText = (baseStyle: TextStyle): TextStyle => ({
  fontFamily: fonts.regular,
  ...baseStyle,
});

export const RobotoText = {
  regular: createRobotoText({}),
  medium: createRobotoText({ fontFamily: fonts.medium }),
  bold: createRobotoText({ fontFamily: fonts.bold }),
};
