import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { CsButton, CsText } from "@/components";
import { useTheme, useThemedStyles } from "@/hooks";
import { spacing, wp, type ITheme } from "@/styles";
import { showToast } from "@/helpers/toast/showToast";
import { useRouter } from "expo-router";
import { auth } from "@/services/appService";
import { ToastColorEnum } from "@/components/ToastMessage/ToastColorEnum";

export default function ConfirmEmailNoticeScreen() {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      await auth.resendConfirmationEmail();
      showToast("Email de confirmation renvoyé !", ToastColorEnum.Success);
    } catch (error) {
      showToast((error as Error).message, ToastColorEnum.Error, 7000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={themedStyles.container}>
      <Image
        source={require("@/assets/images/icon2.png")}
        style={themedStyles.logo}
      />
      <CsText variant="h1" style={themedStyles.title}>
        Confirmez votre email
      </CsText>
      <CsText variant="body" style={themedStyles.body}>
        Veuillez confirmer votre email avec le lien reçu par email. Vérifiez également votre dossier spam.
      </CsText>
      <CsButton
        title="Renvoyer l'email de confirmation"
        onPress={handleResend}
        loading={loading}
        style={themedStyles.button}
      />
      <CsButton
        title="Retour à la connexion"
        onPress={() => router.replace("/signIn")}
        variant="secondary"
        style={themedStyles.button}
      />
    </View>
  );
}

const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.lg,
    },
    logo: {
      width: wp(40),
      height: wp(40),
      marginBottom: spacing.xl,
      objectFit: "contain",
    },
    title: {
      marginBottom: spacing.lg,
      textAlign: "center",
    },
    body: {
      marginBottom: spacing.xl,
      textAlign: "center",
      color: theme.textLight,
    },
    button: {
      marginVertical: spacing.sm,
      alignSelf: "stretch",
    },
  }); 
