import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import {
  signInWithGoogle,
  signUpWithGoogle,
  signOutGoogle,
  configureGoogleSignIn,
  OAuthState,
  GoogleOAuthResult,
} from '@/services/googleOAuthService';
import { setUser } from '@/store/appSlice';
import { showToast } from '@/helpers/toast/showToast';
import { ToastColorEnum } from '@/components/ToastMessage/ToastColorEnum';
import { getUserNameFromEmail } from '@/utils/formatting';
import { supabase } from '@/lib/supabase';

/**
 * Custom hook for Google OAuth authentication
 * Adapted from your web implementation with mobile-specific enhancements
 */
export function useGoogleAuth() {
  const [state, setState] = useState<OAuthState>({
    isLoading: false,
    error: null,
    isAuthenticated: false,
    user: null,
  });

  const dispatch = useDispatch();
  const router = useRouter();

  // Initialize Google Sign-In configuration
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  /**
   * Clear any existing error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Handle successful OAuth result
   */
  const handleOAuthSuccess = useCallback(async (result: GoogleOAuthResult, isSignUp: boolean = false) => {
    if (!result.user) return;

    // Create user object for Redux store
    const user = {
      id: result.user.id,
      email: result.user.email || '',
      firstName: result.user.user_metadata?.given_name || '',
      lastName: result.user.user_metadata?.family_name || '',
      pushToken: '',
      children: [],
    };

    // Update Redux state
    dispatch(setUser(user));

    // Show success toast
    const userName = user.firstName || getUserNameFromEmail(user.email);
    const message = isSignUp
      ? `Bienvenue ! ${userName}`
      : `Connexion réussie ! Bienvenue ${userName}`;
    showToast(message, ToastColorEnum.Success);

    // Update local state
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: null,
      isAuthenticated: true,
      user: result.user,
    }));

    // Check if profile completion is needed
    const isProfileComplete = await checkProfileComplete(user.id);

    if (!isProfileComplete) {
      router.replace('/(app)/(protected)/completeProfile');
    } else {
      router.replace('/(app)/(protected)/(tabs)');
    }
  }, [dispatch, router]);

  /**
   * Handle OAuth error
   */
  const handleOAuthError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error,
      isAuthenticated: false,
      user: null,
    }));

    // Show error toast
    showToast(error, ToastColorEnum.Error, 7000);
  }, []);

  /**
   * Check if user profile is complete
   */
  async function checkProfileComplete(userId: string): Promise<boolean> {
    try {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('first_name, last_name, phone')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking profile completeness:', error);
        return false;
      }

      return Boolean(userProfile?.first_name && userProfile?.last_name && userProfile?.phone);
    } catch (error) {
      console.error('Error in checkProfileComplete:', error);
      return false;
    }
  }

  /**
   * Google Sign-In for existing users
   */
  const googleSignIn = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await signInWithGoogle();

      if (result.success && result.user) {
        await handleOAuthSuccess(result, false);
      } else {
        handleOAuthError(result.error || 'Erreur de connexion avec Google');
      }
    } catch (error: any) {
      handleOAuthError(error.message || 'Erreur de connexion avec Google');
    }
  }, [handleOAuthSuccess, handleOAuthError]);

  /**
   * Google Sign-Up for new users
   */
  const googleSignUp = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await signUpWithGoogle();

      if (result.success && result.user) {
        await handleOAuthSuccess(result, true);
      } else {
        handleOAuthError(result.error || 'Erreur d\'inscription avec Google');
      }
    } catch (error: any) {
      handleOAuthError(error.message || 'Erreur d\'inscription avec Google');
    }
  }, [handleOAuthSuccess, handleOAuthError]);

  /**
   * Sign out from Google and clear state
   */
  const googleSignOut = useCallback(async () => {
    try {
      await signOutGoogle();
      setState({
        isLoading: false,
        error: null,
        isAuthenticated: false,
        user: null,
      });
    } catch (error: any) {
      console.error('Error signing out from Google:', error);
    }
  }, []);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    user: state.user,

    // Actions
    googleSignIn,
    googleSignUp,
    googleSignOut,
    clearError,
  } as const;
}

/**
 * Simplified hook for basic Google OAuth operations
 * Based on your web implementation pattern
 */
export function useGoogleAuthSimple() {
  const {
    googleSignIn,
    googleSignUp,
    googleSignOut,
    isLoading,
    error,
    clearError
  } = useGoogleAuth();

  return {
    googleSignIn,
    googleSignUp,
    googleSignOut,
    isLoading,
    error,
    clearError,
  } as const;
}
