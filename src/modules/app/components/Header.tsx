import { FontAwesome5 } from '@expo/vector-icons';
import { useThemedStyles } from '@src/hooks';
import { colors, spacing, typography } from '@styles/index';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ASPECT_RATIO = 16 / 9; // Adjust this to match your image's aspect ratio
const IMAGE_HEIGHT = SCREEN_WIDTH / ASPECT_RATIO;

export const Header: React.FC = () => {
  const themedStyles = useThemedStyles<typeof styles>(styles);

  return (
    <View style={themedStyles.headerContainer}>
      <ImageBackground
        source={require('@assets/images/school-background.jpg')}
        style={themedStyles.headerBackground}
        resizeMode="cover"
      >
        <View style={themedStyles.overlay} />
        <View style={themedStyles.headerContent}>
          <Image source={require('@assets/images/yeko-logo.png')} style={themedStyles.logo} />
          <TouchableOpacity style={themedStyles.menuButton}>
            <FontAwesome5 name="bars" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
        <View style={themedStyles.profileContainer}>
          <Image
            source={require('@assets/images/profile-pic.webp')}
            style={themedStyles.profilePic}
          />
          <Text style={themedStyles.profileName}>Diane Koffi</Text>
        </View>
      </ImageBackground>
      <View style={themedStyles.orangeBar} />
    </View>
  );
};

const styles = () =>
  StyleSheet.create({
    headerContainer: {
      height: IMAGE_HEIGHT,
      maxHeight: SCREEN_HEIGHT * 0.4, // Limit to 40% of screen height
    },
    headerBackground: {
      width: '100%',
      height: '100%',
      justifyContent: 'space-between',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Add a slight dark overlay for better text visibility
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: spacing.md,
    },
    logo: {
      width: 80,
      height: 40,
      resizeMode: 'contain',
    },
    menuButton: {
      padding: spacing.sm,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
    },
    profilePic: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: spacing.sm,
    },
    profileName: {
      ...typography.NORMAL,
      color: colors.white,
    },
    orangeBar: {
      height: 4,
      backgroundColor: colors.secondary,
    },
  });
