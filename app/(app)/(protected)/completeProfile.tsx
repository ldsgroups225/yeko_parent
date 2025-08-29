import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { CsButton, CsText, CsTextField } from "@/components";
import { useTheme, useThemedStyles } from "@/hooks";
import { spacing, wp, type ITheme } from "@/styles";
import { completeProfileSchema, CompleteProfileFormValues } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "@/helpers/toast/showToast";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/appSlice";
import { auth } from "@/services/appService";
import { ToastColorEnum } from "@/components/ToastMessage/ToastColorEnum";
import { formatFullName } from "@/utils/formatting";
import { normalizeCIPhoneNumber } from "@/utils/phoneUtils";
import { z } from "zod";

// Assume you have a hook or context to get the authenticated user
import { useAuth } from "@/hooks";
import { useAppSelector } from "@/store";

export default function CompleteProfileScreen() {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useAppSelector((s) => s?.AppReducer?.user);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CompleteProfileFormValues) => {
    if (!user) return;
    setLoading(true);
    try {
      // Normalize phone number for Côte d'Ivoire format
      const normalizedPhone = normalizeCIPhoneNumber(data.phone);

      if (!normalizedPhone) {
        throw new Error('Ce numero n\'est pas un numero ivoirien correct')
      }

      // Complete user profile
      await auth.completeUserProfile(user.id, user.email, data.first_name, data.last_name, normalizedPhone);


      // Link parent to students by phone number (only if phone is valid)
      const linkedStudentsCount = normalizedPhone
        ? await auth.linkParentToStudentsByPhone(user.id, normalizedPhone)
        : 0;

      const newUser = {
        id: user.id,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        email: user.email,
        pushToken: '',
        children: [], // Will be populated later
      };

      dispatch(setUser(newUser));

      // Show appropriate success message
      const welcomeMessage = linkedStudentsCount > 0
        ? `Bienvenue ! ${formatFullName(data.first_name, data.last_name)} - ${linkedStudentsCount} enfant(s) lié(s) automatiquement`
        : `Bienvenue ! ${formatFullName(data.first_name, data.last_name)}`;

      showToast(welcomeMessage);
      router.replace("/(app)/(protected)/(tabs)");
    } catch (error) {
      showToast((error as Error).message, ToastColorEnum.Error, 7000);
    } finally {
      setLoading(false);
    }
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
            Complétez votre profil
          </CsText>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(1000).springify()}>
          <Controller
            control={control}
            name="first_name"
            render={({ field: { onChange, value } }) => (
              <CsTextField
                label="Prénom"
                value={value}
                onChangeText={onChange}
                leftIcon={<Ionicons name="person-outline" size={24} color={theme.text} />}
                style={themedStyles.input}
                autoCapitalize="words"
                error={errors.first_name?.message}
              />
            )}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(350).duration(1000).springify()}>
          <Controller
            control={control}
            name="last_name"
            render={({ field: { onChange, value } }) => (
              <CsTextField
                label="Nom de famille"
                value={value}
                onChangeText={onChange}
                leftIcon={<Ionicons name="person-outline" size={24} color={theme.text} />}
                style={themedStyles.input}
                autoCapitalize="words"
                error={errors.last_name?.message}
              />
            )}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(1000).springify()}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <CsTextField
                label="Téléphone"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                leftIcon={<Ionicons name="call-outline" size={24} color={theme.text} />}
                style={themedStyles.input}
                error={errors.phone?.message}
              />
            )}
          />
        </Animated.View>

        <CsButton
          title="Valider"
          onPress={handleSubmit(onSubmit)}
          style={themedStyles.button}
          loading={loading}
        />
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
  }); 
