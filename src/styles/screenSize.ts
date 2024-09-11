import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const screenSize = {
  width,
  height,
  isSmallDevice: width < 375,
};
