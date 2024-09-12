/**
 * @author Ali Burhan Keskin <alikeskin@milvasoft.com>
 */
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

// Components
import CsButton from "@components/CsButton";
import CsText from "@components/CsText";
import CsTextField from "@components/CsTextField";
import PasswordStrengthIndicator from "@components/PasswordStrengthIndicator";
import ProgressSteps from "@components/ProgressSteps";

// Helpers
import translate from "@helpers/localization";
import { navigationRef } from "@helpers/router";
import { showToast } from "@helpers/toast/showToast";

// Hooks
import { useTheme, useThemedStyles } from "@hooks/index";
import { useAuth } from "@hooks/useAuth";

// Utils
import Routes from "@utils/Routes";

// Styles
import { spacing } from "@styles/spacing";
import { ITheme } from "@styles/theme";

export default function Registration() {
  // Hooks
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const { register, loading } = useAuth();

  // States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Navigation Callbacks
  const handleRegister = async () => {
    const success = await register(email, password, firstName, lastName, phone);
    if (!success) return showToast(translate("invalidCredentials"));

    showToast(translate("registrationSuccessful"));
    navigationRef.navigate(Routes.Login);
    clearForm();
  };

  const handleTermsAndConditions = useCallback(() => {
    // TODO: Navigate to Terms and Conditions screen
    showToast(translate("termsAndConditionsNotImplemented"));
  }, [translate]);

  // UI Callbacks
  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Validation Methods
  function isIvorianNumberValid(phoneNumber: string): boolean {
    const regex = /^(?:(?:\+|00)225|0)?(?:0[157])(?:0[1-9]|[1-9]\d)\d{6}$/;
    return regex.test(phoneNumber);
  }

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string) => {
    return password.length >= 8;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  // Form Control Methods
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return firstName.length > 1 && lastName.length > 1;
      case 1:
        return (
          phone.length > 0 &&
          isIvorianNumberValid(phone) &&
          email.length > 0 &&
          isEmailValid(email)
        );
      case 2:
        return (
          password.length > 0 &&
          isPasswordValid(password) &&
          password === confirmPassword
        );
      case 3:
        return acceptTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleRegister().then((r) => r);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigationRef.goBack();
    }
  };

  // Helper Methods
  function clearForm() {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAcceptTerms(false);
    setShowPassword(false);
    setCurrentStep(0);
  }

  return (
    <KeyboardAvoidingView
      style={themedStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      {/* <AnimatedBackground /> */}
      <ScrollView contentContainerStyle={themedStyles.scrollContent}>
        <Image
          source={require("@assets/images/icon.png")}
          style={themedStyles.logo}
        />

        <Animated.View entering={FadeInDown.duration(1000).springify()}>
          <CsText variant="h1" style={themedStyles.title}>
            {translate("createAccount")}
          </CsText>
          <ProgressSteps totalSteps={4} currentStep={currentStep} />
        </Animated.View>

        {currentStep === 0 && (
          <Animated.View
            entering={FadeInUp.delay(300).duration(1000).springify()}
          >
            <CsTextField
              label={translate("firstName")}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              leftIcon={
                <Ionicons name="person-outline" size={24} color={theme.text} />
              }
              style={themedStyles.input}
            />

            <CsTextField
              label={translate("lastName")}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              leftIcon={
                <Ionicons name="person-outline" size={24} color={theme.text} />
              }
              style={themedStyles.input}
            />
          </Animated.View>
        )}

        {currentStep === 1 && (
          <Animated.View
            entering={FadeInUp.delay(300).duration(1000).springify()}
          >
            <CsTextField
              label={translate("phone")}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
              leftIcon={
                <Ionicons
                  name="phone-portrait-outline"
                  size={24}
                  color={theme.text}
                />
              }
              style={themedStyles.input}
              error={
                !isIvorianNumberValid(phone)
                  ? translate("invalidPhoneNumber")
                  : ""
              }
            />

            <CsTextField
              label={translate("email")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={
                <Ionicons name="mail-outline" size={24} color={theme.text} />
              }
              style={themedStyles.input}
              error={
                email.length > 0 && !isEmailValid(email)
                  ? translate("invalidEmail")
                  : ""
              }
            />
          </Animated.View>
        )}

        {currentStep === 2 && (
          <Animated.View
            entering={FadeInUp.delay(300).duration(1000).springify()}
          >
            <CsTextField
              label={translate("password")}
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
                <TouchableOpacity onPress={toggleShowPassword}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color={theme.text}
                  />
                </TouchableOpacity>
              }
              style={themedStyles.input}
            />
            <PasswordStrengthIndicator
              strength={getPasswordStrength(password)}
            />
            <CsTextField
              label={translate("confirmPassword")}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={theme.text}
                />
              }
              style={themedStyles.input}
              error={
                confirmPassword.length > 0 && password !== confirmPassword
                  ? translate("passwordsDoNotMatch")
                  : ""
              }
            />
          </Animated.View>
        )}

        {currentStep === 3 && (
          <Animated.View
            entering={FadeInUp.delay(300).duration(1000).springify()}
          >
            <TouchableOpacity
              style={themedStyles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <Ionicons
                name={acceptTerms ? "checkbox-outline" : "square-outline"}
                size={24}
                color={theme.primary}
              />
              <CsText variant="body" style={themedStyles.termsText}>
                {translate("acceptTerms")}
                <CsText
                  variant="body"
                  style={themedStyles.termsLink}
                  onPress={handleTermsAndConditions}
                >
                  {translate("termsAndConditions")}
                </CsText>
              </CsText>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInUp.delay(500).duration(1000).springify()}
        >
          <View style={themedStyles.buttonContainer}>
            <CsButton
              title={
                currentStep === 0 ? translate("back") : translate("previous")
              }
              onPress={handleBack}
              variant="secondary"
              style={themedStyles.button}
            />
            <CsButton
              loading={loading}
              title={
                currentStep === 3 ? translate("register") : translate("next")
              }
              onPress={handleNext}
              disabled={!canProceed()}
              style={themedStyles.button}
            />
          </View>
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
      width: 150,
      height: 200,
      alignSelf: "center",
      marginBottom: 30,
      objectFit: "contain",
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      padding: spacing.xl,
    },
    title: {
      marginBottom: spacing.xl,
      textAlign: "center",
    },
    input: {
      marginBottom: spacing.lg,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.xl,
    },
    button: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
    termsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: spacing.md,
    },
    termsText: {
      marginLeft: spacing.sm,
      flex: 1,
    },
    termsLink: {
      color: theme.primary,
      textDecorationLine: "underline",
    },
  });
