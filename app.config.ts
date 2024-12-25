import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Yeko",
  description: "yeko",
  slug: "yeko",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png", // recommended 1024x1024 png
  scheme: "io.ldsgroups.yeko",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "io.ldsgroups.yeko",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "io.ldsgroups.yeko",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      }
    ]
  ],
  experiments: {
    typedRoutes: true,
  },
  // updates: {
  //   enabled: true,
  //   url: "https://u.expo.dev/49e4e24d-c928-4ff1-815d-f1a58ca580bd",
  // },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "64e0fe3d-d0d7-4a8c-9823-e834c0d206cf",
    },
  },
  owner: "ldsgroups225",
});
