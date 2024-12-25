import { Stack } from "expo-router";

export const unstable_settings = {
	initialRouteName: "(root)",
};

export default function AppLayout() {
	return (
		<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
			<Stack.Screen name="(protected)/(tabs)" />
			<Stack.Screen name="signIn" />
			{/* <Stack.Screen name="welcome" /> */}
		</Stack>
	);
}
