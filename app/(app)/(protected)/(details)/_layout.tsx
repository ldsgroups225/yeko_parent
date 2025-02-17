import { Stack } from "expo-router";

export default function DetailsLayout() {
	return (
		<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
			<Stack.Screen name="attendanceScreen" />
			<Stack.Screen name="[chatId]" />
			<Stack.Screen name="discussionScreen" />
			<Stack.Screen name="eventScreen" />
			<Stack.Screen name="homeworkScreen" />
			{/* TODO: <Stack.Screen name="newConversationModal" /> */}
			<Stack.Screen name="noteScreen" />
			<Stack.Screen name="scheduleScreen" />
			<Stack.Screen name="feedbackScreen" />
		</Stack>
	);
}
