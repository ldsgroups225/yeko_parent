import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode
  backgroundColor?: string
}

const ScreenWrapper = ({children, backgroundColor}: Props) => {
  const { top } = useSafeAreaInsets()
  const platform = Platform.OS
  
  const paddingTop = platform === "ios" ? top + 5 : top;

  return (
    <View style={{ flex: 1, paddingTop, backgroundColor }}>
      {children}
    </View>
  );
}
 
export default ScreenWrapper;
