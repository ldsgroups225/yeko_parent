import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CsText from "@components/CsText";
import { useTheme, useThemedStyles } from "@hooks/index";
import { spacing } from "@styles/spacing";
import { ITheme } from "@styles/theme";
import { borderRadius } from "@styles/index";

interface CsPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  items: { label: string; value: string }[];
}

const CsPicker: React.FC<CsPickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  items,
}) => {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  return (
    <View style={themedStyles.pickerContainer}>
      <CsText variant="body" style={themedStyles.pickerLabel}>
        {label}
      </CsText>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[
          themedStyles.picker,
          Platform.OS === "android" && { height: 40 },
        ]} // Adjust height for Android
        dropdownIconColor={theme.text}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = (theme: ITheme) =>
  StyleSheet.create({
    pickerContainer: {
      marginBottom: spacing.md,
    },
    pickerLabel: {
      marginBottom: spacing.xs,
    },
    picker: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.text,
    },
  });

export default CsPicker;
