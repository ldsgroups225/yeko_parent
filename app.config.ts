import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Yeko",
  description: "yeko",
  slug: "yeko",
  scheme: "io.ldsgroups.yeko",
  version: "1.0.0",
  sdkVersion: "51.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  userInterfaceStyle: "automatic",
  runtimeVersion: {
    policy: "sdkVersion",
  },
  assetBundlePatterns: ["./src/assets/images/*"],
  locales: {
    tr: "./src/assets/languages/turkish.json",
    en: "./src/assets/languages/english.json",
  },
  splash: {
    image: "./src/assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    bundleIdentifier: "io.ldsgroups.yeko",
    buildNumber: "1.0.0",
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
    },
  },
  web: {
    bundler: "metro",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "io.ldsgroups.yeko",
    versionCode: 1,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
  },
  // updates: {
  //   enabled: true,
  //   url: "https://u.expo.dev/49e4e24d-c928-4ff1-815d-f1a58ca580bd",
  // },
  extra: {
    eas: {
      projectId: "64e0fe3d-d0d7-4a8c-9823-e834c0d206cf",
    },
  },
  owner: "ldsgroups225",
});
