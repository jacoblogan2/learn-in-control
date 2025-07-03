
import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '../types/auth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuthOperations } from '../hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, setCurrentUser, fetchUserProfile } = useUserProfile();
  const { login, signUp, logout: logoutOperation, isLoading } = useAuthOperations();

  // Memoize logout function to prevent re-renders
  const logout = useCallback(() => logoutOperation(setCurrentUser), [logoutOperation, setCurrentUser]);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      }
    };

    getInitialSession();

    // Listen for auth changes - avoid async in the callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!mounted) return;

      if (session?.user) {
        // Use setTimeout to prevent blocking the auth state change
        setTimeout(() => {
          if (mounted) {
            fetchUserProfile(session.user);
          }
        }, 0);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove dependencies to prevent re-runs

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    login,
    logout,
    signUp,
    isLoading,
  }), [currentUser, login, logout, signUp, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
