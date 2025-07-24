import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { CsButton, CsText, CsTextField } from "@/components";
import { useTheme, useThemedStyles } from "@/hooks";
import { spacing, wp, type ITheme } from "@/styles";
import { parentSignUpSchema, ParentSignUpFormValues } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "@/helpers/toast/showToast";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/appSlice";
import { auth } from "@/services/appService";
import { ToastColorEnum } from "@/components/ToastMessage/ToastColorEnum";
import { getUserNameFromEmail } from "@/utils/formatting";

export default function SignUpScreen() {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentSignUpFormValues>({
    resolver: zodResolver(parentSignUpSchema),
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data: ParentSignUpFormValues) => {
    setLoading(true);
    try {
      const response = await auth.createAccount(
        data.email,
        data.password,
      );
      if (!response.data.user) throw new Error('Une erreur est survenue lors de la création du compte. Veuillez réessayer.');
      // Set user in redux and redirect
      const user = {
        id: response.data.user.id,
        email: data.email,
        pushToken: '',
        children: [],
      };
      dispatch(setUser(user));
      showToast(`Bienvenue ! ${getUserNameFromEmail(data.email)}`);
      router.replace("/confirmEmailNotice");
    } catch (error) {
      showToast((error as Error).message, ToastColorEnum.Error, 7000);
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleSignUp = async () => {
  //   setLoading(true);
  //   try {
  //     const { url } = await auth.signInWithGoogle();
  //     if (url) {
  //       window.location.href = url;
  //     }
  //   } catch (error) {
  //     showToast((error as Error).message, ToastColorEnum.Error, 7000);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const goToSignIn = () => {
    router.push('/signIn')
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
            Créez votre compte parent
          </CsText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(450).duration(1000).springify()}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <CsTextField
                label="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Ionicons name="mail-outline" size={24} color={theme.text} />}
                style={themedStyles.input}
                error={errors.email?.message}
              />
            )}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(1000).springify()}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <CsTextField
                label="Mot de passe"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                leftIcon={<Ionicons name="lock-closed-outline" size={24} color={theme.text} />}
                style={themedStyles.input}
                error={errors.password?.message}
              />
            )}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(550).duration(1000).springify()}>
          <Controller
            control={control}
            name="passwordConfirmation"
            render={({ field: { onChange, value } }) => (
              <CsTextField
                label="Confirmation du mot de passe"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                leftIcon={<Ionicons name="lock-closed-outline" size={24} color={theme.text} />}
                style={themedStyles.input}
                error={errors.passwordConfirmation?.message}
              />
            )}
          />
        </Animated.View>

        <CsButton
          title="Créer un compte"
          onPress={handleSubmit(onSubmit)}
          style={themedStyles.button}
          loading={loading}
        />

        {/* <View style={themedStyles.divider}>
          <View style={themedStyles.dividerLine} />
          <CsText variant="caption" style={themedStyles.dividerText}>
            Ou
          </CsText>
          <View style={themedStyles.dividerLine} />
        </View> */}

        {/* <CsButton
          title="Créer un compte avec Google"
          onPress={handleGoogleSignUp}
          variant="secondary"
          icon={<Ionicons name="logo-google" size={24} color={theme.primary} />}
          style={themedStyles.button}
          loading={loading}
        /> */}



        <Animated.View
          entering={FadeInUp.delay(600).duration(1000).springify()}
          style={themedStyles.signInContainer}
        >
          <CsText variant="body">Déjà un compte ?</CsText>
          <TouchableOpacity
            onPress={goToSignIn}
          >
            <CsText variant="body" style={themedStyles.signInText}>
              {" "}
              Se connecter
            </CsText>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
    signInContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: spacing.xl,
    },
    signInText: {
      color: theme.primary,
      fontWeight: "bold",
    },
  }); 
