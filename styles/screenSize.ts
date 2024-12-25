import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const screenSize = {
  width,
  height,
  isSmallDevice: width < 375,
};

const hp = (percent: number) => (percent * height) / 100;
const wp = (percent: number) => (percent * width) / 100;

export { hp, wp, screenSize };
