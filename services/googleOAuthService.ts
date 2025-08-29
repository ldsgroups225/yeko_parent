import {
  GoogleSignin,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';
import { supabase } from '@/lib/supabase';
import { ERole } from '@/types/ILoginDTO';

// Google Profile interface based on your web implementation
export interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified: boolean;
}

// OAuth state interface based on your web implementation  
export interface OAuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: any | null;
}

// OAuth result interface
export interface GoogleOAuthResult {
  success: boolean;
  user?: any;
  error?: string;
  requiresProfile?: boolean;
}

/**
 * Configure Google Sign-In with client IDs
 * Call this once when the app starts
 */
export function configureGoogleSignIn(): void {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
  
  if (!webClientId) {
    console.warn('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID introuvable dans l\'environnement');
    return;
  }

  GoogleSignin.configure({
    webClientId, // From Google Cloud Console (Web client)
    iosClientId, // From Google Cloud Console (iOS client) - optional
    scopes: ['email', 'profile'],
    offlineAccess: true, // For refresh tokens
    forceCodeForRefreshToken: true,
  });
}

/**
 * Sign in with Google for existing users
 * Adapted from your web implementation
 */
export async function signInWithGoogle(): Promise<GoogleOAuthResult> {
  try {
    // Check if Google Play Services are available (Android)
    await GoogleSignin.hasPlayServices();
    
    // Sign in to Google
    const userInfo = await GoogleSignin.signIn();
    
    if (!userInfo.data?.idToken) {
      throw new Error('Erreur lors de la connexion avec Google');
    }

    // Sign in to Supabase with Google ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: userInfo.data.idToken,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Erreur lors de la connexion avec Google');
    }

    // Ensure user has PARENT role - create if doesn't exist
    const roleResult = await ensureUserHasParentRole(data.user.id, data.user.email || '');
    if (!roleResult.success) {
      throw new Error(roleResult.error || 'Oups, vous n\'avez pas de compte parent');
    }

    return {
      success: true,
      user: data.user,
      requiresProfile: false,
    };
  } catch (error: any) {
    return handleGoogleSignInError(error);
  }
}

/**
 * Sign up with Google for new users
 * Adapted from your web implementation with mobile enhancements
 */
export async function signUpWithGoogle(): Promise<GoogleOAuthResult> {
  try {
    // Check if Google Play Services are available (Android)
    await GoogleSignin.hasPlayServices();
    
    // Sign in to Google to get user info
    const userInfo = await GoogleSignin.signIn();
    
    if (!userInfo.data?.idToken) {
      throw new Error('Erreur lors de la connexion avec Google');
    }

    // Sign up to Supabase with Google ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: userInfo.data.idToken,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Erreur lors de la connexion avec Google');
    }

    // Ensure user has PARENT role - create if doesn't exist
    const roleResult = await ensureUserHasParentRole(data.user.id, data.user.email || '');
    if (!roleResult.success) {
      throw new Error(roleResult.error || 'Oups, vous n\'avez pas de compte parent');
    }

    // Check if this is a new user (created less than 1 minute ago)
    const userCreatedAt = new Date(data.user.created_at).getTime();
    const now = Date.now();
    const isNewUser = (now - userCreatedAt) < 60000; // Less than 1 minute

    if (isNewUser) {
      // Create user profile from Google data
      await createUserFromGoogleProfile(data.user.id, {
        sub: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
        picture: data.user.user_metadata?.picture || data.user.user_metadata?.avatar_url,
        given_name: data.user.user_metadata?.given_name,
        family_name: data.user.user_metadata?.family_name,
        email_verified: data.user.email_confirmed_at !== null,
      });
    }

    return {
      success: true,
      user: data.user,
      requiresProfile: isNewUser,
    };
  } catch (error: any) {
    return handleGoogleSignInError(error);
  }
}

/**
 * Create user profile from Google OAuth data
 * Adapted from your web implementation
 */
export async function createUserFromGoogleProfile(
  userId: string,
  googleProfile: GoogleProfile
): Promise<{ success: boolean; error?: string }> {
  try {
    // Parse name intelligently (from your web implementation)
    const nameParts = googleProfile.name.split(' ');
    const firstName = googleProfile.given_name || nameParts[0] || '';
    const lastName = googleProfile.family_name || nameParts.slice(1).join(' ') || '';

    // Create user profile
    const { error: profileError } = await supabase.from('users').upsert({
      id: userId,
      email: googleProfile.email,
      first_name: firstName,
      last_name: lastName,
      avatar_url: googleProfile.picture,
      email_verified: googleProfile.email_verified,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      throw new Error('Impossible de créer votre profil utilisateur');
    }

    // Assign default PARENT role (from your web implementation)
    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id: userId,
      role_id: ERole.PARENT,
      created_at: new Date().toISOString(),
    });

    if (roleError) {
      console.error('Error assigning user role:', roleError);
      throw new Error('Oups, une erreur !! Veillez réessayer');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in createUserFromGoogleProfile:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Ensure user has PARENT role - create if doesn't exist
 * This handles both new and existing users signing in with Google
 */
export async function ensureUserHasParentRole(
  userId: string,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user already has PARENT role
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId)
      .eq('role_id', ERole.PARENT)
      .single();

    if (roleCheckError && roleCheckError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is expected for new users
      console.error('Error checking user role:', roleCheckError);
      throw new Error('Oups, nous n\'avons pas pu nous assurer que ce compte est un compte parent');
    }

    // If user already has PARENT role, we're done
    if (existingRole) {
      return { success: true };
    }

    // Check if user profile exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id, first_name, last_name, phone')
      .eq('id', userId)
      .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('Error checking user profile:', userCheckError);
      throw new Error('Impossible de vérifier votre profil utilisateur');
    }

    // Create user profile if it doesn't exist
    if (!existingUser) {
      const { error: profileError } = await supabase.from('users').upsert({
        id: userId,
        email: userEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw new Error('Impossible de créer votre profil utilisateur');
      }
    }

    // Create PARENT role for the user
    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id: userId,
      role_id: ERole.PARENT,
    });

    if (roleError) {
      console.error('Error assigning PARENT role:', roleError);
      throw new Error('Oups, une erreur !! Veillez réessayer');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in ensureUserHasParentRole:', error);
    return { success: false, error: error.message };
  }
}
function handleGoogleSignInError(error: any): GoogleOAuthResult {
  let errorMessage = 'Une erreur est survenue lors de la connexion avec Google';

  if (error.code) {
    switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        errorMessage = 'Connexion annulée par l\'utilisateur';
        break;
      case statusCodes.IN_PROGRESS:
        errorMessage = 'Une connexion est déjà en cours';
        break;
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        errorMessage = 'Oups, une erreur !! Veillez réessayer';
        break;
      default:
        console.error('Unknown Google Sign-In error:', error);
        errorMessage = error.message || errorMessage;
    }
  } else {
    errorMessage = error.message || errorMessage;
  }

  return {
    success: false,
    error: errorMessage,
  };
}

/**
 * Sign out from Google
 */
export async function signOutGoogle(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Error signing out from Google:', error);
  }
}

/**
 * Get current Google user info if signed in
 */
export async function getCurrentGoogleUser(): Promise<User | null> {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    return currentUser;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user is signed in to Google
 */
export async function isSignedInToGoogle(): Promise<boolean> {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    return currentUser !== null;
  } catch (error) {
    return false;
  }
}
