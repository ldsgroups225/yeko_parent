import translate from "@helpers/localization";
import { useTheme, useThemedStyles } from "@src/hooks";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { styles } from "./style";
import type { GeneralActivityIndicatorProps } from "./type";

const testID = "generalActivityIndicator";
/**
 * Renders a general activity indicator with an optional text.
 *
 * @param {GeneralActivityIndicatorProps} props - The component props.
 * @param {string} props.text - The optional text to display below the activity indicator.
 * @returns {JSX.Element} The rendered GeneralActivityIndicator component.
 */
function GeneralActivityIndicator({
  text,
}: GeneralActivityIndicatorProps): JSX.Element {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  // TODO Modal
  return (
    <View
      testID={`${testID}-container-view`}
      style={themedStyles.activityIndicator}
    >
      <ActivityIndicator
        testID={`${testID}-container-activityIndicator`}
        animating
        size="large"
        color={theme.primary}
      />
      <Text style={themedStyles.activityIndicatorText}>
        {text || translate("generalActivityIndicatorText")}
      </Text>
    </View>
  );
}

export default GeneralActivityIndicator;
