import React from "react";
import { Image, View, StyleSheet, Text, ImageBackground, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BlurView, BlurTint } from 'expo-blur';
import { useRouter } from "expo-router";
import { hp, screenSize, wp } from "@/styles";
import { CsButton } from "@/components";
import { useThemedStyles } from "@/hooks";

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSpring, 
  Easing 
} from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonYPosition = useSharedValue(0);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{ translateY: buttonYPosition.value }],
    };
  });

  React.useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.ease });
    titleOpacity.value = withTiming(1, { duration: 800, easing: Easing.ease });
    buttonOpacity.value = withTiming(1, { duration: 800, easing: Easing.ease });

    buttonYPosition.value = withRepeat(
      withSpring(-10, { // Move the button up by 10 pixels
        damping: 6, // Controls the bounciness (lower = bouncier)
        stiffness: 90, // Controls the spring stiffness (higher = stiffer)
      }),
      -1,
      true
    );
  }, []);

  const renderContent = () => {
    const contentStyle = themedStyles.contentContainer;

    if (Platform.OS === 'ios') {
      return (
        <BlurView
          intensity={60}
          tint={'light' as BlurTint}
          style={contentStyle}
        >
          {renderMainContent()}
        </BlurView>
      );
    }

    return (
      <View style={[contentStyle, themedStyles.androidBlur]}>
        {renderMainContent()}
      </View>
    );
  };

  const renderMainContent = () => (
    <>
      <Animated.View style={[themedStyles.logoContainer, logoAnimatedStyle]}>
        <Image
          source={require("@/assets/images/icon2.png")}
          style={themedStyles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={[themedStyles.titleContainer, titleAnimatedStyle]}>
        <Text style={themedStyles.subtitle}>
          La transparence éducative
        </Text>
        <Text style={themedStyles.description}>
          Votre application de suivi de ponctualité, notes, scolarité, et communication avec les professeurs, le tout dans la transparence la plus totale.
        </Text>
      </Animated.View>

      <Animated.View style={[themedStyles.footer, buttonAnimatedStyle]}>
        <CsButton
          title="Se connecter"
          onPress={() => router.push('/signIn')}
        />
      </Animated.View>
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      <View style={themedStyles.container}>
        <ImageBackground
          source={require("@/assets/images/bg_img.png")}
          style={themedStyles.backgroundImage}
          resizeMode="cover"
        >
          {renderContent()}
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    backgroundImage: {
      width: screenSize.width,
      height: screenSize.height,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: wp(4),
      paddingTop: hp(5),
      paddingBottom: hp(3),
      justifyContent: "space-between",
    },
    androidBlur: {
      backgroundColor: 'rgba(0, 0, 0, 0.89)',
    },
    logoContainer: {
      marginTop: hp(10),
      alignItems: "center",
    },
    logo: {
      width: wp(55),
      height: hp(22),
    },
    titleContainer: {
      gap: hp(1),
      alignItems: 'center',
      marginTop: hp(35),
    },
    subtitle: {
      textAlign: "center",
      paddingHorizontal: wp(10),
      color: '#F5F5F5',
      fontSize: hp(2.2),
      opacity: 0.8,
      lineHeight: hp(2.5),
      fontWeight: 'bold',
      fontFamily: 'Poppins-Bold',
    },
    description: {
      textAlign: "center",
      paddingHorizontal: wp(10),
      color: 'rgba(245, 245, 245, 0.6)',
      fontSize: hp(1.6),
      opacity: 0.9,
      lineHeight: hp(2.3),
      marginTop: hp(1),
    },
    footer: {
      gap: hp(2),
      width: '100%',
      marginTop: 'auto',
      paddingHorizontal: wp(3),
      paddingBottom: hp(1),
    },
  });
