import { useTheme } from "@/hooks";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function DetailsLayout() {
	const theme = useTheme();

	return (
		<>
			<StatusBar hidden={false} backgroundColor={theme.primary} />

			<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
				<Stack.Screen name="attendanceScreen" />
				<Stack.Screen name="[chatId]" />
				<Stack.Screen name="discussionScreen" />
				<Stack.Screen name="eventScreen" />
				<Stack.Screen name="homeworkScreen" />
				<Stack.Screen name="newConversationModal" options={{ presentation: "modal" }} />
				<Stack.Screen name="noteScreen" />
				<Stack.Screen name="scheduleScreen" />
				<Stack.Screen name="feedbackScreen" />
			</Stack>
		</>
	);
}
