import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {useTheme} from "@/hooks";
import type { ErrorComponentProps } from "./type";
import { styles } from "./style";

const testID = "errorcomponent";
const ErrorComponent = ({ errorMessage, onRetry }: ErrorComponentProps) => {
  const theme = useTheme();
  return (
    <View style={styles.container} testID={testID + "-" + "container"}>
      <MaterialIcons name="error" size={50} color={theme.primary} />

      <Text style={styles.message}>{errorMessage}</Text>

      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.buttonText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorComponent;
