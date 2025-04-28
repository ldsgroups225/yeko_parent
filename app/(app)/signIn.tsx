import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

// Components
import { CsButton, CsText, CsTextField } from "@/components";

// Helpers
import { showToast } from "@/helpers/toast/showToast";

// Hooks
import { useTheme, useThemedStyles, useAuth } from "@/hooks";

// Redux
import { setUser } from "@/store/appSlice";

// Utils
import { formatFullName } from "@/utils/formatting";

// Styles
import { type ITheme, spacing, wp } from "@/styles";
import { IUserDTO } from "@/types/ILoginDTO";
import { useRouter } from "expo-router";
import { unknown } from "zod";
import { ToastColorEnum } from "@/components/ToastMessage/ToastColorEnum";

export default function SignInScreen() {
  // Hooks
  const router = useRouter();
  const dispatch = useDispatch();
  const { login, loading } = useAuth();
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Navigation Callbacks
  const goHomePage = useCallback(
    (user: IUserDTO) => {
      const fullName = formatFullName(user.firstName, user.lastName);
      showToast(`Bienvenue ! ${fullName}`);
      dispatch(setUser(user));
      clearForm();
      router.replace("/(app)/(protected)/(tabs)");
    },
    [dispatch, router]
  );

  // Auth Callbacks
  const handleLogin = async () => {
    if (!email || !password) {
      return showToast("Veuillez remplir tous les champs.");
    }

    try {
      const auth = await login(email, password);
      if (!auth.user) throw new Error('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
      
      goHomePage(auth.user);
    } catch (error) {
      showToast((error as Error).message , ToastColorEnum.Error, 7000);
    }
  };

  // Helper Methods
  const clearForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <KeyboardAvoidingView
      style={themedStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Image
        source={require("@/assets/images/icon2.png")}
        style={themedStyles.logo}
      />
      <ScrollView contentContainerStyle={themedStyles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(1000).springify()}>
          <CsText variant="h1" style={themedStyles.title}>
            Content de vous revoir !
          </CsText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(300).duration(1000).springify()}
        >
          <CsTextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={
              <Ionicons name="mail-outline" size={24} color={theme.text} />
            }
            style={themedStyles.input}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(1000).springify()}
        >
          <CsTextField
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon={
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color={theme.text}
              />
            }
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={theme.text}
                />
              </TouchableOpacity>
            }
            style={themedStyles.input}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(500).duration(1000).springify()}
        >
          <TouchableOpacity
            onPress={() => showToast("Fonctionnalité non implémentée.")}
            style={themedStyles.forgotPassword}
          >
            <CsText variant="caption">Mot de passe oublié ?</CsText>
          </TouchableOpacity>

          <CsButton
            title="Connexion"
            onPress={handleLogin}
            style={themedStyles.button}
            loading={loading}
          />

          <View style={themedStyles.divider}>
            <View style={themedStyles.dividerLine} />
            <CsText variant="caption" style={themedStyles.dividerText}>
              Ou
            </CsText>
            <View style={themedStyles.dividerLine} />
          </View>

          <CsButton
            title="Connexion avec Google"
            onPress={() => showToast("Fonctionnalité non implémentée.")}
            variant="secondary"
            icon={
              <Ionicons name="logo-google" size={24} color={theme.primary} />
            }
            style={themedStyles.button}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(600).duration(1000).springify()}
          style={themedStyles.registerContainer}
        >
          <CsText variant="body">Pas encore de compte ?</CsText>
          <TouchableOpacity
            onPress={() => showToast("Fonctionnalité non implémentée.")}
          >
            <CsText variant="body" style={themedStyles.registerText}>
              {" "}
              Créer un compte
            </CsText>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    logo: {
      width: wp(55),
      height: wp(55),
      alignSelf: "center",
      marginTop: 30,
      objectFit: "contain",
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.sm,
    },
    title: {
      marginBottom: spacing.xxl,
      textAlign: "center",
    },
    input: {
      marginBottom: spacing.lg,
    },
    button: {
      marginVertical: spacing.md,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: spacing.md,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      marginHorizontal: spacing.md,
      color: theme.textLight,
    },
    registerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: spacing.xl,
    },
    registerText: {
      color: theme.primary,
      fontWeight: "bold",
    },
  });
