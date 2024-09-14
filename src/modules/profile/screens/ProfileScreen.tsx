/**
 * @author Ali Burhan Keskin <alikeskin@milvasoft.com>
 */
import React, { useState } from "react";
import { ColorSchemeName, Image, StyleSheet, Switch, View } from "react-native";
import { useDispatch } from "react-redux";

// Components
import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import CsListTile from "@components/CsListTile";
import CsButton from "@components/CsButton";
import CsPicker from "@components/CsPicker";

// Hooks
import { useTheme, useThemedStyles } from "@hooks/index";
import { useAppSelector } from "@src/store";
import { useAuth } from "@hooks/useAuth";
import useLocale from "@hooks/useLocale";

// Redux
import { loggedOut, setUserColorScheme } from "@modules/app/redux/appSlice";

// Types
import { ITheme } from "@styles/theme";
import { SupportedLocale } from "@helpers/global/i18nInstance";

// Helpers
import translate from "@helpers/localization";
import { showToast } from "@helpers/toast/showToast";

// Styles
import { borderRadius, spacing } from "@styles/index";

// Language Item Interface
interface ILanguageItemProps {
  label: string;
  value: SupportedLocale;
}

const ProfileScreen: React.FC = () => {
  // Hooks and Redux
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const dispatch = useDispatch();
  const user = useAppSelector((s) => s?.AppReducer?.user);
  const selectedTheme = useAppSelector((s) => s?.AppReducer?.userColorScheme);
  const { locale, changeLocale } = useLocale();
  const { logout, loading } = useAuth();

  // States
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  // Callbacks
  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response) dispatch(loggedOut());
    } catch (_) {
      showToast("Un problème rencontré lors de la déconnexion, réessayer");
    }
  };

  const handleThemeChange = (theme: string) => {
    const _theme: ColorSchemeName =
      theme === "system" ? null : (theme as ColorSchemeName);
    dispatch(setUserColorScheme(_theme));
  };

  const handleLanguageChange = (language: SupportedLocale) => {
    changeLocale(language);
  };

  // Data for Pickers
  const themeItems = [
    { label: translate("system"), value: "system" },
    { label: translate("dark"), value: "dark" },
    { label: translate("light"), value: "light" },
  ];

  const languageItems: ILanguageItemProps[] = [
    { label: translate("fr"), value: "fr" },
    { label: translate("en"), value: "en" },
    { label: translate("tr"), value: "tr" },
  ];

  // Main Render
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

        {/* Theme Picker */}
        <CsPicker
          label={translate("theme")}
          selectedValue={selectedTheme ?? "system"}
          onValueChange={handleThemeChange}
          items={themeItems}
        />

        {/* Language Picker */}
        <CsPicker
          label={translate("language")}
          selectedValue={locale}
          onValueChange={handleLanguageChange}
          items={languageItems}
        />

        {/* Notifications Setting */}
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

      {/* Logout Button */}
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

// Styles
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
