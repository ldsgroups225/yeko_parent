import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { enableScreens } from "react-native-screens";
import { Slot } from "expo-router";
import { Provider } from "react-redux";
import * as ScreenOrientation from "expo-screen-orientation";
import { Platform } from "react-native";

import Store from "../store";
import CustomProvider from "../providers";

enableScreens();

function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== "web") {
      // TODO: Orientation Configuration
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  }, []);

  return (
    // @ts-ignore
    <Provider store={Store}>
      {/* @ts-ignore */}
      <CustomProvider>
        <Slot />
      </CustomProvider>
    </Provider>
  );
}

export default RootLayout;
