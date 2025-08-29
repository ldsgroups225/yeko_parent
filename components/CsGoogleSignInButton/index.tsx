import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme, useThemedStyles } from '@/hooks';
import { useGoogleAuthSimple } from '@/hooks/useGoogleAuth';
import { styles } from './style';
import type { CsGoogleSignInButtonProps } from './type';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const testID = 'csGoogleSignInButton';

/**
 * Google Logo SVG Component
 * Based on official Google brand colors from your web implementation
 */
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </Svg>
);

/**
 * Google Sign-In Button Component
 * Following existing CsButton patterns with Google OAuth integration
 */
const CsGoogleSignInButton: React.FC<CsGoogleSignInButtonProps> = ({
  onPress,
  mode = 'signin',
  size = 'medium',
  disabled = false,
  loading: externalLoading = false,
  style,
  textStyle,
  onAuthAttempt,
}) => {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const { googleSignIn, googleSignUp, isLoading, clearError } = useGoogleAuthSimple();

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Determine if button is loading (internal or external)
  const isLoadingState = isLoading || externalLoading;
  
  // Determine button text based on mode
  const buttonText = mode === 'signin' 
    ? 'Se connecter avec Google'
    : 'S\'inscrire avec Google';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (!disabled && !isLoadingState) {
      scale.value = withSpring(0.97);
      opacity.value = withSpring(0.8);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  };

  const handlePress = async () => {
    try {
      // Clear any previous errors
      clearError();

      // Call custom onPress if provided
      if (onPress) {
        onPress();
        return;
      }

      // Call appropriate OAuth function based on mode
      if (mode === 'signin') {
        await googleSignIn();
      } else {
        await googleSignUp();
      }

      // Notify parent component of auth attempt success
      onAuthAttempt?.(true);
    } catch (error) {
      console.error('Google OAuth error:', error);
      onAuthAttempt?.(false);
    }
  };

  const handlePressWrapper = () => {
    runOnJS(handlePress)();
  };

  const buttonStyle = [
    themedStyles.button,
    themedStyles[`button${size}`],
    (disabled || isLoadingState) && themedStyles.buttonDisabled,
    style,
  ];

  const textStyleArray = [
    themedStyles.buttonText,
    themedStyles[`text${size}`],
    (disabled || isLoadingState) && themedStyles.textDisabled,
    textStyle,
  ];

  return (
    <AnimatedPressable
      testID={`${testID}-pressable`}
      onPress={handlePressWrapper}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoadingState}
      style={[buttonStyle, animatedStyle]}
      android_ripple={{ color: theme.rippleColor }}
    >
      {isLoadingState ? (
        <ActivityIndicator
          testID={`${testID}-loading`}
          color={theme.text}
          size="small"
        />
      ) : (
        <>
          <View style={themedStyles.iconContainer}>
            <GoogleIcon size={themedStyles.googleLogo.width} />
          </View>
          <Text testID={`${testID}-text`} style={textStyleArray}>
            {buttonText}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
};

export default CsGoogleSignInButton;
