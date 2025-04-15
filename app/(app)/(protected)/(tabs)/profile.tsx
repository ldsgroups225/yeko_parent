// ---- File: ProfileScreen.tsx ----

import React, { useState } from "react";
import { Image, StyleSheet, Switch, View, TouchableOpacity, Clipboard } from "react-native";
import { useDispatch } from "react-redux";

// Components
import { CsCard, CsText, CsListTile, CsButton } from "@/components";

// Hooks
import { useTheme, useThemedStyles, useAuth } from "@/hooks";
import { useAppSelector } from "@/store";

// Redux
import { loggedOut } from "@/store/appSlice";

// Types
import { ITheme } from "@/styles";
import { ToastColorEnum } from "@/components/ToastMessage/ToastColorEnum";

// Helpers
import { showToast } from "@/helpers/toast/showToast";

// Styles
import { spacing } from "@/styles";
import borderRadius from "@/styles/borderRadius";
import { formatFullName } from "@/utils/formatting";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { otp } from "@/services/otpService";

const ProfileScreen: React.FC = () => {
  // Hooks and Redux
  const router = useRouter();
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const dispatch = useDispatch();
  const user = useAppSelector((s) => s?.AppReducer?.user);
  // const selectedTheme = useAppSelector((s) => s?.AppReducer?.userColorScheme); // Keep if theme switching is re-enabled
  const { logout, loading: authLoading } = useAuth();

  // States
  const [otpGenerationLoading, setOtpGenerationLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  // Callbacks
  const handleGenerateOTP = async () => {
    setGeneratedOtp(null);
    setOtpGenerationLoading(true);
    try {
      const otpValue = await otp.generateOTP();
      if (otpValue) {
        setGeneratedOtp(otpValue);
        showToast("Code généré avec succès!", ToastColorEnum.Success);
        // Consider adding a timer here to clear the OTP after 5 minutes
      } else {
        // This case might not be reached if generateOTP throws, but good for robustness
        showToast("Erreur inattendue lors de la génération du code.", ToastColorEnum.Error);
      }
    } catch (error: any) {
      // Catch the error thrown by otp.generateOTP
      showToast(error.message || "Un problème est survenu lors de la génération du code.", ToastColorEnum.Error);
    } finally {
      setOtpGenerationLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response) {
        dispatch(loggedOut());
        // No need for router.replace if the layout handles redirection based on auth state
        router.replace("/signIn");
      } else {
         showToast("La déconnexion a échoué.", ToastColorEnum.Error);
      }
    } catch (_) {
      showToast("Un problème est survenu lors de la déconnexion.", ToastColorEnum.Error);
    }
  };

  const copyOtpToClipboard = () => {
    if (generatedOtp) {
      Clipboard.setString(generatedOtp);
      showToast("Code copié dans le presse-papiers!", ToastColorEnum.Info);
    }
  };

  // Main Render
  return (
    <View style={themedStyles.container}>
      <CsCard style={themedStyles.profileCard}>
        {/* Profile Header */}
        <View style={themedStyles.profileHeader}>
          <Image
            source={require("@/assets/images/profile-pic.webp")}
            style={themedStyles.avatar}
          />
          <View>
            <CsText variant="h2" style={themedStyles.userName}>
              {user ? formatFullName(user.firstName, user.lastName) : "Utilisateur"}
            </CsText>
            <CsText variant="caption" style={themedStyles.userEmail}>
              {user?.email}
            </CsText>
          </View>
        </View>

        {/* Settings Section */}
        <CsText variant="h3" style={themedStyles.sectionTitle}>Paramètres</CsText>

        {/* Notifications Setting */}
        <CsListTile
          title="Notifications Push"
          subtitle={isNotificationsEnabled ? "Activées" : "Désactivées"}
          leading={<Ionicons name={isNotificationsEnabled ? "notifications" : "notifications-off"} size={24} color={theme.textLight} />}
          trailing={
            <Switch
              value={isNotificationsEnabled}
              onValueChange={setIsNotificationsEnabled}
              trackColor={{ false: theme.gray400, true: theme.primaryLight }}
              thumbColor={theme.background}
              ios_backgroundColor={theme.gray400}
            />
          }
        />

        {/* Feedback Setting */}
        <CsListTile
          title="Signaler un problème"
          subtitle="Faire un retour ou signaler un bug"
          leading={<Ionicons name="flag-outline" size={24} color={theme.textLight} />}
          trailing={
            <Ionicons name="chevron-forward" size={24} color={theme.gray600} />
          }
          onPress={() => router.push("/(app)/(protected)/(details)/feedbackScreen")}
        />

        {/* Child Enrollment Section */}
        <CsText variant="h3" style={themedStyles.sectionTitle}>Inscription Enfant</CsText>

        {/* Generate OTP Button */}
        <CsButton
          title="Générer un code d'inscription"
          onPress={handleGenerateOTP}
          disabled={otpGenerationLoading}
          loading={otpGenerationLoading} 
          variant="secondary"
          style={themedStyles.otpButton}
          icon={<Ionicons name="keypad-outline" size={20} color={theme.primary} />}
        />

        {/* Display Generated OTP */}
        {generatedOtp && (
          <View style={themedStyles.otpDisplayContainer}>
            <CsText style={themedStyles.otpLabel}>Code généré (valide 18 hr/1 enfant):</CsText>
            <View style={themedStyles.otpCodeRow}>
              <CsText style={themedStyles.otpCode}>{generatedOtp}</CsText>
              <TouchableOpacity onPress={copyOtpToClipboard} style={themedStyles.copyButton}>
                <Ionicons name="copy-outline" size={24} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

      </CsCard>

      {/* Logout Button */}
      <CsButton
        title="Se déconnecter"
        onPress={handleLogout}
        disabled={authLoading}
        loading={authLoading} 
        style={themedStyles.logoutButton}
        variant="primary"
        icon={<Ionicons name="log-out-outline" size={20} color={theme.background} />}
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
      marginBottom: spacing.xl,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    userName: {
      color: theme.text,
      fontWeight: 'bold',
    },
    userEmail: {
      color: theme.textLight,
      fontSize: 14,
    },
    sectionTitle: {
      color: theme.primary,
      marginTop: spacing.sm,
      marginBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingBottom: spacing.xs,
    },
    otpButton: {
      marginTop: spacing.sm,
    },
    otpDisplayContainer: {
      marginTop: spacing.sm,
      padding: spacing.md,
      backgroundColor: theme.primary + '1A',
      borderRadius: borderRadius.medium,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.primary + '40',
    },
    otpLabel: {
      color: theme.textLight,
      fontSize: 14,
      marginBottom: spacing.sm,
    },
    otpCodeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    otpCode: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.primary,
      letterSpacing: 3,
      paddingTop: spacing.xs,
      marginRight: spacing.md,
    },
    copyButton: {
      padding: spacing.xs,
    },
    logoutButton: {
      marginTop: 'auto',
      backgroundColor: theme.error,
    },
  });

export default ProfileScreen;
