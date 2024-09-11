import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import { useThemedStyles } from "@hooks/index";
import { spacing } from "@src/styles";
import React from "react";
import { StyleSheet, View } from "react-native";

export type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

export const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress }) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);

  return (
    <CsCard style={themedStyles.menuItem} onPress={onPress}>
      <View style={themedStyles.menuItemContent}>
        {icon}
        <CsText variant="body" style={themedStyles.menuItemText}>
          {label}
        </CsText>
      </View>
    </CsCard>
  );
};

const styles = () =>
  StyleSheet.create({
    menuItem: {
      width: "45%",
      aspectRatio: 1,
      marginBottom: spacing.md,
    },
    menuItemContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    menuItemText: {
      marginTop: spacing.xs,
      textAlign: "center",
    },
  });
