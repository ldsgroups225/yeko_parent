import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppSelector } from "@src/store";
import translate from "@helpers/localization";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@src/hooks";
import { navigationRef } from "@helpers/router";
import Login from "@modules/app/screens/Login";
import BottomNavigation from "./BottomNavigation";
import { ScreenOptions } from "@utils/ScreenOptions";
import Routes, { RootStackParams } from "@utils/Routes";
import Registration from "@modules/app/screens/Register";
import { useAuth } from "@hooks/useAuth";
import LoadingSpinner from "@components/LoadingSpinner";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@modules/app/redux/appSlice";
import PunctualityScreen from "@modules/app/screens/PunctualityScreen";

enableScreens();

const Stack = createStackNavigator<RootStackParams>();

function RootNavigation() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { checkAuth, loading } = useAuth();
  const userColorScheme = useAppSelector((s) => s?.AppReducer?.userColorScheme);

  const [isSignedIn, setIsSignedIn] = useState(false);

  const isDarkTheme = userColorScheme === "dark";

  useEffect(() => {
    checkAuth().then((r) => {
      setIsSignedIn(!!r);
      dispatch(setUser(r));
    });
  }, []);

  const navigationTheme = {
    dark: isDarkTheme,
    colors: {
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.notification,
    },
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName={isSignedIn ? Routes.Home : Routes.Login}
          screenOptions={{ ...ScreenOptions, headerTintColor: theme.primary }}
        >
          {isSignedIn ? (
            <>
              <Stack.Screen
                name={Routes.Home}
                component={BottomNavigation}
                options={{
                  gestureEnabled: false,
                  headerShown: false,
                  headerTitle: translate("navigation.home"),
                }}
              />
              <Stack.Screen
                name={Routes.Punctuality}
                component={PunctualityScreen}
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: "transparent" },
                  title: "Ponctualité",
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name={Routes.Login}
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={Routes.Register}
                component={Registration}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default RootNavigation;
