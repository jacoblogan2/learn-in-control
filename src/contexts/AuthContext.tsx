
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '../types/auth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuthOperations } from '../hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, setCurrentUser, fetchUserProfile } = useUserProfile();
  const { login, signUp, logout: logoutOperation, isLoading } = useAuthOperations();
  const isInitializing = useRef(true);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listener');
    
    // Get initial session
    const getInitialSession = async () => {
      console.log('AuthProvider: Getting initial session');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('AuthProvider: Found initial session for user:', session.user.id);
        if (lastUserId.current !== session.user.id) {
          lastUserId.current = session.user.id;
          await fetchUserProfile(session.user);
        }
      } else {
        console.log('AuthProvider: No initial session found');
        setCurrentUser(null);
      }
      isInitializing.current = false;
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip processing during initialization to prevent loops
      if (isInitializing.current) {
        console.log('AuthProvider: Skipping auth change during initialization');
        return;
      }

      console.log('AuthProvider: Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        // Only fetch profile if the user ID actually changed
        if (lastUserId.current !== session.user.id) {
          console.log('AuthProvider: User changed, fetching new profile');
          lastUserId.current = session.user.id;
          await fetchUserProfile(session.user);
        } else {
          console.log('AuthProvider: Same user, skipping profile fetch');
        }
      } else {
        console.log('AuthProvider: No session, clearing user');
        lastUserId.current = null;
        setCurrentUser(null);
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, setCurrentUser]);

  const logout = () => {
    console.log('AuthProvider: Logging out');
    lastUserId.current = null;
    logoutOperation(setCurrentUser);
  };

  const value = {
    currentUser,
    login,
    logout,
    signUp,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
