import { useAuthCheck } from "@/providers/SupabaseProvider";
import { Redirect, useSegments } from 'expo-router';
import LoadingScreen from "@/components/LoadingScreen";
import { useAppSelector } from "@/store";

const IndexScreen = () => {
  const segments = useSegments();
  const checkAuth = useAuthCheck()
  const user = useAppSelector((s) => s?.AppReducer?.user);
  const isProfileComplete = Boolean(user?.firstName && user?.lastName && user?.phone);

  const inProtectedGroup = segments[1] === "(protected)";

  if (!checkAuth.initialized) return <LoadingScreen />;

  else {
    if (checkAuth.session && !inProtectedGroup) {
      if (isProfileComplete) {
        return <Redirect href="/(app)/(protected)/(tabs)" />
      } else {
        return <Redirect href="/(app)/(protected)/completeProfile" />
      }
    }
    else if (!checkAuth.session) {
      return <Redirect href="/(app)/welcome" />
    }
  }
}

export default IndexScreen;
