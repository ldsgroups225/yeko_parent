/**
 * @author Ali Burhan Keskin <alikeskin@milvasoft.com>
 */
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Components
import { Ionicons } from "@expo/vector-icons";
import Popover from "react-native-popover-view";
import CsText from "@components/CsText";
import { MenuItem } from "@modules/app/components/MenuItem";

// Hooks
import { useTheme, useThemedStyles } from "@hooks/index";
import { useAppSelector } from "@src/store";

// Redux
import { loggedOut, setSelectedStudent } from "@modules/app/redux/appSlice";

// Types
import { ITheme } from "@styles/theme";
import { IStudentDTO } from "../types/ILoginDTO";

// Navigation
import { navigationRef } from "@helpers/router";
import Routes from "@utils/Routes";

// Styles
import { spacing } from "@src/styles";

// Animations
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

// Localization
import translate from "@helpers/localization";

const Home: React.FC = () => {
  // Hooks and Redux
  const user = useAppSelector((s) => s?.AppReducer?.user);
  const theme = useTheme();
  const dispatch = useDispatch();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  // States
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState(user?.children[0]);

  // Animations
  const headerOpacity = useSharedValue(0);
  const menuItemsOpacity = useSharedValue(0);

  // Effects
  useEffect(() => {
    // Animate header and menu items on component mount
    headerOpacity.value = withDelay(300, withSpring(1));
    menuItemsOpacity.value = withDelay(600, withSpring(1));

    // Set initial selected student
    const selectedStudent = user?.children[0];
    dispatch(setSelectedStudent(selectedStudent));
  }, [dispatch, user]);

  // If user is not logged in, redirect to login
  if (!user) {
    dispatch(loggedOut());
    return null;
  }

  // Data for Image Background
  const image = { uri: selectedChild?.school.imageUrl ?? "" };

  // Animated Styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const menuItemsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: menuItemsOpacity.value,
  }));

  // Callbacks
  const handleChildSelect = (child: IStudentDTO) => {
    setSelectedChild(child);
    dispatch(setSelectedStudent(child));
    setPopoverVisible(false);
  };

  // Menu Items Data
  const menuItems = [
    {
      icon: <Ionicons name="time-outline" size={24} color={theme.primary} />,
      label: translate("attendance"),
      onPress: () => navigationRef.navigate(Routes.Attendance),
    },
    {
      icon: (
        <Ionicons
          name="document-text-outline"
          size={24}
          color={theme.primary}
        />
      ),
      label: translate("notes"),
      onPress: () => navigationRef.navigate(Routes.Note),
    },
    {
      icon: (
        <Ionicons name="calendar-outline" size={24} color={theme.primary} />
      ),
      label: translate("schedule"),
      onPress: () => navigationRef.navigate(Routes.Schedule),
    },
    {
      icon: <Ionicons name="book-outline" size={24} color={theme.primary} />,
      label: translate("exercises"),
      onPress: () => navigationRef.navigate(Routes.Homework),
    },
    {
      icon: (
        <Ionicons name="chatbubbles-outline" size={24} color={theme.primary} />
      ),
      label: translate("discussion"),
      onPress: () => navigationRef.navigate(Routes.Discussion),
    },
    {
      icon: (
        <Ionicons
          name="information-circle-outline"
          size={24}
          color={theme.primary}
        />
      ),
      label: translate("infoAndSchooling"),
      onPress: () => navigationRef.navigate(Routes.Info),
    },
  ];

  // Main Render
  return (
    <>
      {/* Animated Header */}
      <Animated.View style={[themedStyles.header, headerAnimatedStyle]}>
        <ImageBackground
          source={image}
          style={themedStyles.headerBackground}
          resizeMode="cover"
        >
          <View style={themedStyles.headerOverlay}>
            <View style={themedStyles.schoolInfo}>
              <CsText variant="h3" style={themedStyles.schoolName}>
                {selectedChild?.school.name}
              </CsText>
            </View>
            <View style={themedStyles.userContainer}>
              <Image
                source={require("@assets/images/icon.png")}
                style={themedStyles.yekoLogo}
              />
              <View style={themedStyles.userInfoContainer}>
                <TouchableOpacity
                  style={themedStyles.userInfo}
                  onPress={() => setPopoverVisible(true)}
                >
                  <Image
                    source={require("@assets/images/profile-pic.webp")}
                    style={themedStyles.avatar}
                  />
                  <View style={themedStyles.userTextContainer}>
                    <CsText variant="body" style={themedStyles.userName}>
                      {selectedChild?.lastName} {selectedChild?.firstName}
                    </CsText>
                    <CsText variant="caption" style={themedStyles.userRole}>
                      {selectedChild?.class.name}
                    </CsText>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="white" />
                </TouchableOpacity>

                {/* Child Selection Popover */}
                <Popover
                  isVisible={isPopoverVisible}
                  onRequestClose={() => setPopoverVisible(false)}
                  from={
                    <TouchableOpacity
                      style={themedStyles.userInfo}
                      onPress={() => setPopoverVisible(true)}
                    />
                  }
                >
                  <View style={themedStyles.popoverContent}>
                    {user.children.map((child) => (
                      <TouchableOpacity
                        key={child.id}
                        style={themedStyles.childItem}
                        onPress={() => handleChildSelect(child)}
                      >
                        <Image
                          source={require("@assets/images/profile-pic.webp")}
                          style={themedStyles.childAvatar}
                        />
                        <View>
                          <CsText variant="body" style={themedStyles.childName}>
                            {child.lastName} {child.firstName}
                          </CsText>
                          <CsText
                            variant="caption"
                            style={themedStyles.childClass}
                          >
                            {child.class.name}
                          </CsText>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Popover>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

      {/* Animated Menu Items */}
      <Animated.View
        style={[themedStyles.menuContainer, menuItemsAnimatedStyle]}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </Animated.View>
    </>
  );
};

// Styles
const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      height: 180,
    },
    headerBackground: {
      flex: 1,
    },
    headerOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "space-between",
      padding: spacing.md,
    },
    schoolInfo: {
      alignItems: "flex-start",
    },
    schoolName: {
      color: "white",
      fontWeight: "bold",
    },
    userContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    yekoLogo: {
      width: 60,
      height: 60,
      resizeMode: "contain",
    },
    userInfoContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 25,
      padding: spacing.xs,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.sm,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: spacing.sm,
    },
    userTextContainer: {
      marginRight: spacing.sm,
    },
    userName: {
      color: "white",
      fontWeight: "bold",
    },
    userRole: {
      color: "rgba(255, 255, 255, 0.8)",
    },
    menuContainer: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      alignItems: "flex-start",
      paddingHorizontal: spacing.md,
      paddingTop: spacing.lg,
    },
    logo: {
      width: 80,
      height: 40,
      resizeMode: "contain",
    },
    popoverContent: {
      padding: spacing.md,
      backgroundColor: theme.background,
      borderRadius: 8,
      minWidth: 200,
    },
    childItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
    },
    childAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: spacing.sm,
    },
    childName: {
      fontWeight: "bold",
      color: theme.text,
    },
    childClass: {
      color: theme.textLight,
    },
  });

export default Home;
