import { useTheme, useThemedStyles } from "@src/hooks";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { styles } from "./style";
import type { CsButtonProps } from "./type";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const testID = "csButton";

const CsButton: React.FC<CsButtonProps> = ({
  onPress,
  title,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  icon,
  style,
  textStyle,
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
    scale.value = withSpring(0.97);
    opacity.value = withSpring(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  };

  const handlePress = () => {
    runOnJS(onPress)();
  };

  const buttonStyle = [
    themedStyles.button,
    themedStyles[`button${variant}`],
    themedStyles[`button${size}`],
    disabled && themedStyles.buttonDisabled,
    style,
  ];

  const textStyleArray = [
    themedStyles.buttonText,
    themedStyles[`text${variant}`],
    themedStyles[`text${size}`],
    disabled && themedStyles.textDisabled,
    textStyle,
  ];

  return (
    <AnimatedPressable
      testID={`${testID}-pressable`}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[buttonStyle, animatedStyle]}
      android_ripple={{ color: theme.rippleColor }}
    >
      {loading ? (
        <ActivityIndicator
          testID={`${testID}-loading`}
          color={theme.background}
          size="small"
        />
      ) : (
        <>
          {icon && (
            <Animated.View style={themedStyles.icon}>{icon}</Animated.View>
          )}
          <Text testID={`${testID}-text`} style={textStyleArray}>
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
};

export default CsButton;
