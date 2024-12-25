import { useAuthCheck } from "@/providers/SupabaseProvider";
import { Redirect, useSegments } from 'expo-router';
import LoadingScreen from "@/components/LoadingScreen";

const IndexScreen = () => {
  const segments = useSegments();
  const checkAuth = useAuthCheck()
  const inProtectedGroup = segments[1] === "(protected)";

  if (!checkAuth.initialized) return <LoadingScreen />;

  else {
    if (checkAuth.session && !inProtectedGroup)
      return <Redirect href="/(app)/(protected)/(tabs)" />
    else if (!checkAuth.session)
      return<Redirect href="/(app)/welcome" />
  }
}
 
export default IndexScreen;
