import CsText from "@components/CsText";
import { useThemedStyles } from "@hooks/index";
import { spacing } from "@styles/spacing";
import { ITheme } from "@styles/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ProgressStepsProps {
  totalSteps: number;
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  totalSteps,
  currentStep,
}) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);

  return (
    <View style={themedStyles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <View
              style={[
                themedStyles.connector,
                index <= currentStep
                  ? themedStyles.activeConnector
                  : themedStyles.inactiveConnector,
              ]}
            />
          )}
          <View
            style={[
              themedStyles.step,
              index < currentStep
                ? themedStyles.completedStep
                : index === currentStep
                ? themedStyles.activeStep
                : themedStyles.inactiveStep,
            ]}
          >
            <CsText
              variant="caption"
              style={StyleSheet.flatten([
                themedStyles.stepText,
                index <= currentStep
                  ? themedStyles.activeStepText
                  : themedStyles.inactiveStepText,
              ])}
            >
              {index < currentStep ? "✓" : (index + 1).toString()}
            </CsText>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    step: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
    },
    completedStep: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    activeStep: {
      backgroundColor: theme.background,
      borderColor: theme.primary,
    },
    inactiveStep: {
      backgroundColor: theme.background,
      borderColor: theme.border,
    },
    stepText: {
      fontSize: 14,
      fontWeight: "bold",
    },
    activeStepText: {
      color: theme.primary,
    },
    inactiveStepText: {
      color: theme.textLight,
    },
    connector: {
      height: 2,
      width: 30,
      marginHorizontal: spacing.xs,
    },
    activeConnector: {
      backgroundColor: theme.primary,
    },
    inactiveConnector: {
      backgroundColor: theme.border,
    },
  });

export default ProgressSteps;
