// components/FeedbackScreen.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { CsText, CsCard } from "@/components";
import { spacing, type ITheme } from "@/styles";
import { useFeedback, useThemedStyles } from "@/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeedbackFormValues, FeedbackSchema } from "@/utils/validators";
import { ToastColorEnum } from "@/components/ToastMessage/ToastColorEnum";
import { showToast } from "@/helpers/toast/showToast";
import { useRouter } from "expo-router";

export default function FeedbackScreen() {
  const router = useRouter();
  const themedStyles = useThemedStyles(styles);

  const { control, handleSubmit, formState, reset } = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: { feedbackType: "recommendation", message: "", userEmail: null }
  });

  const { createFeedback, loading, error } = useFeedback();

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      await createFeedback(data);
      router.back();
      reset();
      showToast("Merci pour votre feedback !!", ToastColorEnum.Success, 3000);
    } catch {}
  };

  return (
   <SafeAreaView style={{flex: 1}}>
     <View style={themedStyles.container}>
      <CsText variant="h1" style={themedStyles.title}>Soumettre un Feedback</CsText>
      
      {error && (
        <Animated.View 
          style={themedStyles.errorAlert}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
        >
          <CsText>{error}</CsText>
        </Animated.View>
      )}

      <CsCard style={themedStyles.card}>
        <Controller
          control={control}
          name="feedbackType"
          render={({ field }) => (
            <View style={themedStyles.inputGroup}>
              <CsText style={themedStyles.label}>Type de Feedback</CsText>
              <View style={themedStyles.pickerContainer}>
                <TouchableOpacity
                  style={[
                    themedStyles.pickerOption,
                    field.value === 'recommendation' && themedStyles.activeOption
                  ]}
                  onPress={() => field.onChange('recommendation')}
                >
                  <CsText>Avis</CsText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    themedStyles.pickerOption,
                    field.value === 'bug' && themedStyles.activeOption
                  ]}
                  onPress={() => field.onChange('bug')}
                >
                  <CsText>Bug</CsText>
                </TouchableOpacity>
              </View>
              {formState.errors.feedbackType && (
                <CsText style={themedStyles.errorText}>
                  {formState.errors.feedbackType.message}
                </CsText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <View style={themedStyles.inputGroup}>
              <CsText style={themedStyles.label}>Message</CsText>
              <TextInput
                style={themedStyles.textArea}
                multiline
                numberOfLines={4}
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Décrivez votre feedback..."
              />
              {formState.errors.message && (
                <CsText style={themedStyles.errorText}>
                  {formState.errors.message.message}
                </CsText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="userEmail"
          render={({ field }) => (
            <View style={themedStyles.inputGroup}>
              <CsText style={themedStyles.label}>Email (optionnel)</CsText>
              <TextInput
                style={themedStyles.input}
                keyboardType="email-address"
                value={field.value || ''}
                onChangeText={field.onChange}
                placeholder="your@email.com"
              />
              {formState.errors.userEmail && (
                <CsText style={themedStyles.errorText}>
                  {formState.errors.userEmail.message}
                </CsText>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          style={[
            themedStyles.submitButton,
            loading && themedStyles.submitDisabled
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <CsText style={themedStyles.buttonText}>
            {loading ? 'Envoi en cours...' : 'Envoyer'}
          </CsText>
        </TouchableOpacity>
      </CsCard>
    </View>
   </SafeAreaView>
  );
}

const styles = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: theme.background,
  },
  title: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    color: theme.primary,
  },
  card: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    color: theme.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: spacing.sm,
    color: theme.text,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: spacing.sm,
    textAlignVertical: 'top',
    color: theme.text,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pickerOption: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  activeOption: {
    backgroundColor: theme.primary + '20',
    borderColor: theme.primary,
  },
  submitButton: {
    backgroundColor: theme.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.background,
    fontWeight: 'bold',
  },
  errorText: {
    color: theme.notification,
    marginTop: spacing.xs,
  },
  successAlert: {
    backgroundColor: '#DFF0D8',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
});
