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
import AttendanceScreen from "@modules/app/screens/AttendanceScreen";
import HomeworkScreen from "@modules/app/screens/HomeworkScreen";

enableScreens();

const Stack = createStackNavigator<RootStackParams>();

function RootNavigation() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { checkAuth, loading } = useAuth();
  const [repeatTime, setRepeatTime] = useState(0);
  const isSignedIn = useAppSelector((s) => s.AppReducer?.isSignedIn);
  const userColorScheme = useAppSelector((s) => s?.AppReducer?.userColorScheme);

  const isDarkTheme = userColorScheme === "dark";

  useEffect(() => {
    if (!isSignedIn) {
      setRepeatTime((prevState) => prevState++);
      checkAuth().then((r) => {
        if (!r) return;
        dispatch(setUser(r));
      });
    }
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
          initialRouteName={isSignedIn ? Routes.Core : Routes.Login}
          screenOptions={{ ...ScreenOptions, headerTintColor: theme.primary }}
        >
          {isSignedIn ? (
            <>
              <Stack.Screen
                name={Routes.Core}
                component={BottomNavigation}
                options={{
                  gestureEnabled: false,
                  headerShown: false,
                  headerTitle: translate("navigation.home"),
                }}
              />
              <Stack.Screen
                name={Routes.Attendance}
                component={AttendanceScreen}
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: "transparent" },
                  title: "Ponctualité",
                }}
              />
              <Stack.Screen
                name={Routes.Homework}
                component={HomeworkScreen}
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: "transparent" },
                  title: "Exercices",
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
