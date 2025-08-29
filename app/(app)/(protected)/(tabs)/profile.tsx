// ---- File: ProfileScreen.tsx ----

import React, { useState } from "react";
import { Image, StyleSheet, Switch, View, TouchableOpacity } from "react-native";
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
// import { otp } from "@/services/otpService";

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
  // const [otpGenerationLoading, setOtpGenerationLoading] = useState(false);
  // const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  // Callbacks
  // const handleGenerateOTP = async () => {
  //   setGeneratedOtp(null);
  //   setOtpGenerationLoading(true);
  //   try {
  //     const otpValue = await otp.generateOTP();
  //     if (otpValue) {
  //       setGeneratedOtp(otpValue);
  //       showToast("Code généré avec succès!", ToastColorEnum.Success);
  //       // Consider adding a timer here to clear the OTP after 5 minutes
  //     } else {
  //       // This case might not be reached if generateOTP throws, but good for robustness
  //       showToast("Erreur inattendue lors de la génération du code.", ToastColorEnum.Error, 7000);
  //     }
  //   } catch (error: any) {
  //     // Catch the error thrown by otp.generateOTP
  //     showToast(error.message || "Un problème est survenu lors de la génération du code.", ToastColorEnum.Error, 7000);
  //   } finally {
  //     setOtpGenerationLoading(false);
  //   }
  // };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response) {
        dispatch(loggedOut());
        // No need for router.replace if the layout handles redirection based on auth state
        router.replace("/signIn");
      } else {
        showToast("La déconnexion a échoué.", ToastColorEnum.Error, 7000);
      }
    } catch (_) {
      showToast("Un problème est survenu lors de la déconnexion.", ToastColorEnum.Error, 7000);
    }
  };

  // const copyOtpToClipboard = () => {
  //   if (generatedOtp) {
  //     Clipboard.setString(generatedOtp);
  //     showToast("Code copié dans le presse-papiers!", ToastColorEnum.Info);
  //   }
  // };

  const handleEditProfile = () => {
    router.push('/(app)/(protected)/editProfile');
  };

  // Main Render
  return (
    <View style={themedStyles.container}>
      {/* Profile Avatar */}
      <View style={themedStyles.avatarContainer}>
        <Image
          source={require("@/assets/images/profile-pic.webp")}
          style={themedStyles.avatar}
        />
      </View>

      {/* Profile Info Card */}
      <CsCard style={themedStyles.profileInfoCard}>
        <View style={themedStyles.profileInfo}>
          <CsText variant="h2" style={themedStyles.userName}>
            {user ? formatFullName(user.firstName, user.lastName) : "Utilisateur"}
          </CsText>
          <CsText variant="caption" style={themedStyles.userEmail}>
            {user?.email}
          </CsText>
          <CsText variant="caption" style={themedStyles.userPhone}>
            {user?.phone ? `📱 ${user.phone}` : "Aucun téléphone"}
          </CsText>
        </View>
        <TouchableOpacity onPress={handleEditProfile} style={themedStyles.editButton}>
          <Ionicons name="pencil-outline" size={20} color={theme.primary} />
        </TouchableOpacity>
      </CsCard>

      <CsCard style={themedStyles.settingsCard}>

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
        {/* <CsText variant="h3" style={themedStyles.sectionTitle}>Inscription Enfant</CsText> */}

        {/* Generate OTP Button */}
        {/* <CsButton
          title="Générer un code d'inscription"
          onPress={handleGenerateOTP}
          disabled={otpGenerationLoading}
          loading={otpGenerationLoading}
          variant="secondary"
          style={themedStyles.otpButton}
          icon={<Ionicons name="keypad-outline" size={20} color={theme.primary} />}
        /> */}

        {/* Display Generated OTP */}
        {/* {generatedOtp && (
          <View style={themedStyles.otpDisplayContainer}>
            <CsText style={themedStyles.otpLabel}>Code généré (valide 18 hr/1 enfant):</CsText>
            <View style={themedStyles.otpCodeRow}>
              <CsText style={themedStyles.otpCode}>{generatedOtp}</CsText>
              <TouchableOpacity onPress={copyOtpToClipboard} style={themedStyles.copyButton}>
                <Ionicons name="copy-outline" size={24} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )} */}

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
    avatarContainer: {
      alignItems: 'center',
      marginBottom: spacing.sm,
      marginTop: spacing.lg,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: theme.primary,
    },
    profileInfoCard: {
      padding: spacing.lg,
      marginBottom: spacing.sm,
      position: 'relative',
    },
    profileInfo: {
      alignItems: 'center',
      paddingRight: spacing.xl,
    },
    settingsCard: {
      padding: spacing.lg,
      marginBottom: spacing.sm,
    },
    userName: {
      color: theme.text,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    userEmail: {
      color: theme.textLight,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    sectionTitle: {
      color: theme.primary,
      marginVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingBottom: spacing.xs,
    },
    // otpButton: {
    //   marginTop: spacing.sm,
    // },
    // otpDisplayContainer: {
    //   marginTop: spacing.sm,
    //   padding: spacing.md,
    //   backgroundColor: theme.primary + '1A',
    //   borderRadius: borderRadius.medium,
    //   alignItems: 'center',
    //   borderWidth: 1,
    //   borderColor: theme.primary + '40',
    // },
    // otpLabel: {
    //   color: theme.textLight,
    //   fontSize: 14,
    //   marginBottom: spacing.sm,
    // },
    // otpCodeRow: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    // otpCode: {
    //   fontSize: 28,
    //   fontWeight: 'bold',
    //   color: theme.primary,
    //   letterSpacing: 3,
    //   paddingTop: spacing.xs,
    //   marginRight: spacing.md,
    // },
    // copyButton: {
    //   padding: spacing.xs,
    // },
    logoutButton: {
      marginTop: 'auto',
      backgroundColor: theme.error,
    },
    userInfo: {
      flex: 1,
    },
    userPhone: {
      color: theme.textLight,
      fontSize: 14,
      textAlign: 'center',
    },
    editButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      padding: spacing.sm,
      borderRadius: borderRadius.small,
      backgroundColor: theme.primary + '1A',
      borderWidth: 1,
      borderColor: theme.primary + '40',
    },
  });

export default ProfileScreen;
