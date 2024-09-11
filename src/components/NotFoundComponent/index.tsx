import React from "react";
import { Text, View } from "react-native";
import { styles } from "./style";
import { NotFoundComponentProps } from "./type";

const testID = "notFoundComponent";
/**
 * Renders a component for displaying a "Not Found" message.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to be displayed.
 * @returns {JSX.Element} The rendered component.
 */
const NotFoundComponent = ({ title }: NotFoundComponentProps): JSX.Element => (
  <View style={styles.root} testID={`${testID}-container-view`}>
    <Text style={styles.title} testID={`${testID}-title-text`}>
      {title}
    </Text>
  </View>
);

export default NotFoundComponent;
