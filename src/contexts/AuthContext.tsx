
import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '../types/auth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuthOperations } from '../hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, setCurrentUser, fetchUserProfile } = useUserProfile();
  const { login, signUp, logout: logoutOperation, isLoading } = useAuthOperations();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, setCurrentUser]);

  const logout = () => logoutOperation(setCurrentUser);

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
