import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ColorSchemeName } from "react-native";
import { IAppState, ProfileCompletion } from "./IAppState";

const initialState: IAppState = {
  isSignedIn: false,
  userColorScheme: "light",
  isLoading: false,
  user: undefined,
  authToken: undefined,
  expoToken: undefined,
  profileCompletion: {
    currentStep: 0,
    theme: "auto",
    language: "english",
    avatar: "",
    gender: "",
    country: "",
    city: "",
    grade: "",
    referral: "",
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsSignedIn: (state, action: PayloadAction<boolean>) => {
      state.isSignedIn = action.payload;
    },
    setUserColorScheme: (state, action: PayloadAction<ColorSchemeName>) => {
      state.userColorScheme = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<any | undefined>) => {
      state.user = action.payload;
    },
    loggedOut: (state) => {
      state = { ...state, user: undefined, isSignedIn: false, authToken: "" };
      return state;
    },
    setAuthToken: (state, action: PayloadAction<string | undefined>) => {
      state.authToken = action.payload;
    },
    setExpoToken: (state, action: PayloadAction<string | undefined>) => {
      state.expoToken = action.payload;
    },
    setProfileCompletion: (
      state,
      action: PayloadAction<Partial<ProfileCompletion>>
    ) => {
      state.profileCompletion = {
        ...state.profileCompletion,
        ...action.payload,
      };
    },
  },
});

export const {
  setIsSignedIn,
  setUserColorScheme,
  setIsLoading,
  setUser,
  loggedOut,
  setAuthToken,
  setExpoToken,
  setProfileCompletion,
} = appSlice.actions;

export default appSlice.reducer;
