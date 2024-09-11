import { useTheme, useThemedStyles } from '@src/hooks';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { styles } from './style';
import type { CsListTileProps } from './type';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const testID = 'csListTile';

const CsListTile: React.FC<CsListTileProps> = ({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  dense = false,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97);
      opacity.value = withSpring(0.8);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
      opacity.value = withSpring(1);
    }
  };

  const handlePress = () => {
    if (onPress) {
      runOnJS(onPress)();
    }
  };

  const containerStyle = [themedStyles.container, dense && themedStyles.dense, style];

  const content = (
    <>
      {leading && <View>{leading}</View>}
      <View style={themedStyles.contentContainer}>
        <Text style={[themedStyles.title, titleStyle]}>{title}</Text>
        {subtitle && <Text style={[themedStyles.subtitle, subtitleStyle]}>{subtitle}</Text>}
      </View>
      {trailing && <View style={themedStyles.trailing}>{trailing}</View>}
    </>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        testID={`${testID}-pressable`}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[containerStyle, animatedStyle]}
        android_ripple={{ color: theme.rippleColor }}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return (
    <View testID={`${testID}-container`} style={containerStyle}>
      {content}
    </View>
  );
};

export default CsListTile;
