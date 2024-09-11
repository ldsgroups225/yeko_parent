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
import type { CsCardProps } from './type';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const testID = 'csCard';

const CsCard: React.FC<CsCardProps> = ({
  title,
  content,
  footer,
  onPress,
  style,
  titleStyle,
  contentStyle,
  footerStyle,
  children,
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
      scale.value = withSpring(0.98);
      opacity.value = withSpring(0.9);
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

  const containerStyle = [themedStyles.container, style];

  const cardContent = (
    <>
      {title && <Text style={[themedStyles.title, titleStyle]}>{title}</Text>}
      {content && <Text style={[themedStyles.content, contentStyle]}>{content}</Text>}
      {children}
      {footer && <View style={[themedStyles.footer, footerStyle]}>{footer}</View>}
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
        {cardContent}
      </AnimatedPressable>
    );
  }

  return (
    <View testID={`${testID}-container`} style={containerStyle}>
      {cardContent}
    </View>
  );
};

export default CsCard;
