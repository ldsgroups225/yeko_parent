import * as React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
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
import { useDispatch } from "react-redux";
import { setUser } from "@modules/app/redux/appSlice";
import AttendanceScreen from "@modules/app/screens/AttendanceScreen";
import HomeworkScreen from "@modules/app/screens/HomeworkScreen";
import NoteScreen from "@modules/app/screens/NoteScreen";
import ScheduleScreen from "@modules/app/screens/ScheduleScreen";
import DiscussionScreen from "@modules/app/screens/DiscussionScreen";
import EventScreen from "@modules/app/screens/EventScreen";
import throttle from "lodash.throttle";

enableScreens();

const Stack = createStackNavigator<RootStackParams>();

function RootNavigation() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { checkAuth, loading, setPushToken } = useAuth();
  const isSignedIn = useAppSelector((s) => s.AppReducer?.isSignedIn);
  const user = useAppSelector((s) => s.AppReducer?.user);
  const token = useAppSelector((s) => s.AppReducer?.expoToken);
  const userColorScheme = useAppSelector((s) => s?.AppReducer?.userColorScheme);

  const isDarkTheme = userColorScheme === "dark";
  const recheckAuthTriggered = useRef(false);

  const recheckAuth = useCallback(async () => {
    const r = await checkAuth();
    if (r) {
      dispatch(setUser(r));
    }
  }, [checkAuth, dispatch, user, token]);

  const throttledSetPushToken = useMemo(
    () =>
      throttle(
        (userId: string, pushToken: string) => {
          setPushToken(userId, pushToken).then((r) => r);
        },
        5000,
        { leading: true, trailing: true }
      ),
    []
  );

  useEffect(() => {
    // Trigger recheckAuth only once when not signed in
    if (!isSignedIn && !recheckAuthTriggered.current) {
      recheckAuth().then((r) => r);
      recheckAuthTriggered.current = true;
    } else if (isSignedIn && user && token) {
      if (user && token) throttledSetPushToken(user.id, token);
    }

    return () => {
      throttledSetPushToken.cancel();
    };
  }, [isSignedIn, user, token]);

  const navigationTheme = useMemo(
    () => ({
      dark: isDarkTheme,
      colors: {
        primary: theme.primary,
        background: theme.background,
        card: theme.card,
        text: theme.text,
        border: theme.border,
        notification: theme.notification,
      },
    }),
    [isDarkTheme, theme]
  );

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
              <Stack.Group
                screenOptions={{
                  headerShown: true,
                  headerStyle: { backgroundColor: "transparent" },
                }}
              >
                <Stack.Screen
                  name={Routes.Attendance}
                  component={AttendanceScreen}
                  options={{ title: "Ponctualité" }}
                />
                <Stack.Screen
                  name={Routes.Note}
                  component={NoteScreen}
                  options={{ title: "Note" }}
                />
                <Stack.Screen
                  name={Routes.Schedule}
                  component={ScheduleScreen}
                  options={{ title: "Emploi du temps" }}
                />
                <Stack.Screen
                  name={Routes.Homework}
                  component={HomeworkScreen}
                  options={{ title: "Exercices" }}
                />
                <Stack.Screen
                  name={Routes.Discussion}
                  component={DiscussionScreen}
                  options={{ title: "Discussion" }}
                />
                <Stack.Screen
                  name={Routes.Info}
                  component={EventScreen}
                  options={{ title: "Info et scolarité" }}
                />
              </Stack.Group>
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

export default React.memo(RootNavigation);
