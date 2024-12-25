import { useTheme, useThemedStyles } from "@/hooks";
import { ITheme, spacing } from "@/styles";
import { Picker } from "@react-native-picker/picker";
import { View, Platform, StyleSheet } from "react-native";
import CsText from "../CsText";
import borderRadius from "@/styles/borderRadius";


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
