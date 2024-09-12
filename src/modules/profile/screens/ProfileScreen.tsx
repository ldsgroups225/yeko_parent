import React, { useState } from "react";
import { View, StyleSheet, Switch, Image } from "react-native";
import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import CsListTile from "@components/CsListTile";
import CsButton from "@components/CsButton";
import { useTheme, useThemedStyles } from "@hooks/index";
import { spacing } from "@styles/spacing";
import { ITheme } from "@styles/theme";
import { useAppSelector } from "@src/store";
import { loggedOut } from "@modules/app/redux/appSlice";
import translate from "@helpers/localization";
import { showToast } from "@helpers/toast/showToast";
import { useDispatch } from "react-redux";
import CsPicker from "@components/CsPicker";
import { borderRadius } from "@styles/index";
import { useAuth } from "@hooks/useAuth";

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const dispatch = useDispatch();
  const user = useAppSelector((s) => s?.AppReducer?.user);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("system");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(loggedOut());
      // navigationRef.navigate(Routes.Login);
    } catch (_) {
      showToast("Un problème rencontré lors de la déconnexion, réessayer");
    }
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    // Implement actual theme change logic here
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    // Implement actual language change logic here
  };

  const themeItems = [
    { label: translate("system"), value: "system" },
    { label: translate("dark"), value: "dark" },
    { label: translate("light"), value: "light" },
  ];

  const languageItems = [
    { label: translate("fr"), value: "fr" },
    { label: translate("en"), value: "en" },
    { label: translate("tr"), value: "tr" },
  ];

  return (
    <View style={themedStyles.container}>
      <CsCard style={themedStyles.profileCard}>
        <View style={themedStyles.profileHeader}>
          <Image
            source={require("@assets/images/profile-pic.webp")}
            style={themedStyles.avatar}
          />
          <CsText variant="h2" style={themedStyles.userName}>
            {user?.children?.length
              ? user?.children[0]?.firstName + " " + user?.children[0]?.lastName
              : "user name"}
          </CsText>
        </View>

        <CsPicker
          label={translate("theme")}
          selectedValue={selectedTheme}
          onValueChange={handleThemeChange}
          items={themeItems}
        />

        <CsPicker
          label={translate("language")}
          selectedValue={selectedLanguage}
          onValueChange={handleLanguageChange}
          items={languageItems}
        />

        <CsListTile
          title={translate("notifications")}
          trailing={
            <Switch
              value={isNotificationsEnabled}
              onValueChange={setIsNotificationsEnabled}
              trackColor={{ false: theme.gray400, true: theme.primary }}
              thumbColor={theme.background}
            />
          }
        />
      </CsCard>

      <CsButton
        title={translate("logout")}
        onPress={handleLogout}
        disabled={loading}
        loading={loading}
        style={themedStyles.logoutButton}
      />
    </View>
  );
};

const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: spacing.md,
    },
    profileCard: {
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: spacing.md,
    },
    userName: {
      color: theme.text,
    },
    logoutButton: {
      marginTop: spacing.md,
    },
    pickerContainer: {
      marginBottom: spacing.md,
    },
    pickerLabel: {
      marginBottom: spacing.xs,
    },
    picker: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.text,
    },
  });

export default ProfileScreen;
