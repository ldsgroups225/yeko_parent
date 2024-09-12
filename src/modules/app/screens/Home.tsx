import CsText from "@components/CsText";
import { Ionicons } from "@expo/vector-icons";
import { navigationRef } from "@helpers/router";
import { useTheme, useThemedStyles } from "@hooks/index";
import { MenuItem, MenuItemProps } from "@modules/app/components/MenuItem";
import { spacing } from "@src/styles";
import { useAppSelector } from "@src/store";
import { showToast } from "@helpers/toast/showToast";
import { ITheme } from "@styles/theme";
import Routes from "@utils/Routes";
import React, { useEffect } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { loggedOut } from "@modules/app/redux/appSlice";
import { useDispatch } from "react-redux";

const Home: React.FC = () => {
  const user = useAppSelector((s) => s?.AppReducer?.user);
  const theme = useTheme();
  const dispatch = useDispatch();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const headerOpacity = useSharedValue(0);
  const menuItemsOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withDelay(300, withSpring(1));
    menuItemsOpacity.value = withDelay(600, withSpring(1));
  }, []);

  if (!user) {
    dispatch(loggedOut());
    return null;
  }

  const image = { uri: user.children[0].school.imageUrl };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const menuItemsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: menuItemsOpacity.value,
  }));

  const menuItems: MenuItemProps[] = [
    {
      icon: <Ionicons name="time-outline" size={24} color={theme.primary} />,
      label: "Ponctualité",
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
      label: "Notes",
      onPress: () =>
        showToast("L'écran des notes n'est pas encore implementer"), // navigationRef.navigate(Routes.Note),
    },
    {
      icon: (
        <Ionicons name="calendar-outline" size={24} color={theme.primary} />
      ),
      label: "Emploi du temps",
      onPress: () =>
        showToast("L'écran de l'emploi du temps n'est pas encore implementer"), // navigationRef.navigate(Routes.Schedule),
    },
    {
      icon: <Ionicons name="book-outline" size={24} color={theme.primary} />,
      label: "Exercices",
      onPress: () => navigationRef.navigate(Routes.Homework),
    },
    {
      icon: (
        <Ionicons name="chatbubbles-outline" size={24} color={theme.primary} />
      ),
      label: "Discussion",
      onPress: () =>
        showToast("L'écran des discussions n'est pas encore implementer"), // navigationRef.navigate(Routes.Discussion),
    },
    {
      icon: (
        <Ionicons
          name="information-circle-outline"
          size={24}
          color={theme.primary}
        />
      ),
      label: "Info et scolarité",
      onPress: () =>
        showToast(
          "L'écran des infos et scolarité n'est pas encore implementer"
        ), // navigationRef.navigate(Routes.Info),
    },
  ];

  return (
    <>
      <Animated.View style={[themedStyles.header, headerAnimatedStyle]}>
        <ImageBackground
          source={image}
          style={themedStyles.headerBackground}
          resizeMode="cover"
        >
          <View style={themedStyles.headerOverlay}>
            <View style={themedStyles.schoolInfo}>
              <CsText variant="h3" style={themedStyles.schoolName}>
                {user.children[0].school.name}
              </CsText>
            </View>
            <View style={themedStyles.userContainer}>
              <Image
                source={require("@assets/images/icon.png")}
                style={themedStyles.yekoLogo}
              />
              <View style={themedStyles.userInfoContainer}>
                <TouchableOpacity style={themedStyles.userInfo}>
                  <Image
                    source={require("@assets/images/profile-pic.webp")}
                    style={themedStyles.avatar}
                  />
                  <View style={themedStyles.userTextContainer}>
                    <CsText variant="body" style={themedStyles.userName}>
                      {user.children[0].lastName} {user.children[0].firstName}
                    </CsText>
                    <CsText variant="caption" style={themedStyles.userRole}>
                      {user.children[0].class.name}
                    </CsText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
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
  });

export default Home;
