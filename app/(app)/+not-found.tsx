import { CsText } from "@/components";
import { View } from "react-native";

export default function NotFound() {
	return (
		<View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<CsText variant="h1" className="text-center">404</CsText>
			<CsText variant="caption" className="text-center">This page could not be found.</CsText>
		</View>
	);
}
