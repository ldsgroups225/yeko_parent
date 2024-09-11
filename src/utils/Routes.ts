/**
 * Enum representing the available routes in the application.
 */
export enum Routes {
  Home = "Home",
  Login = "Login",
  Register = "Register",
  Discussion = "Discussion",
  ConversationDetail = "ConversationDetail",
  Homework = "Homework",
  Info = "Info",
  Note = "Note",
  Punctuality = "Punctuality",
  Schedule = "Schedule",
  Profile = "Profile",
  Settings = "Settings",
  Post = "Post",
}

/**
 * Represents the parameter types for the root stack navigation.
 */
export type RootStackParams = {
  [Routes.Home]: undefined;
  [Routes.Login]: undefined;
  [Routes.Register]: undefined;
  [Routes.Discussion]: undefined;
  [Routes.Homework]: undefined;
  [Routes.Info]: undefined;
  [Routes.Note]: undefined;
  [Routes.Punctuality]: undefined;
  [Routes.Schedule]: undefined;
  // TODO: Make it as security
  [Routes.ConversationDetail]: {
    templateId: string;
    templateTitle: string;
    recipient: string;
  };
};

/**
 * Represents the parameter types for the profile stack routes.
 */
export type ProfileStackParams = {
  [Routes.Profile]: undefined;
  [Routes.Settings]: undefined;
  [Routes.Post]: { id: string; username: string };
};

/**
 * Represents the navigation parameters for the root stack.
 */
export type NavigationParams = RootStackParams;

export default Routes;
