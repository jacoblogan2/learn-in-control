
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '../types/auth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuthOperations } from '../hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, setCurrentUser, fetchUserProfile } = useUserProfile();
  const { login, signUp, logout: logoutOperation, isLoading } = useAuthOperations();
  const [isInitialized, setIsInitialized] = useState(false);
  const lastUserId = useRef<string | null>(null);
  const isProcessingAuth = useRef(false);
  const authListenerSet = useRef(false);

  console.log('AuthProvider: Rendering with user:', currentUser?.id, 'isLoading:', isLoading, 'isInitialized:', isInitialized);

  // Memoize the fetch function to prevent dependency cycles
  const memoizedFetchUserProfile = useCallback(async (user: any) => {
    if (isProcessingAuth.current || !user) return;
    
    console.log('AuthProvider: Fetching profile for user:', user.id);
    try {
      await fetchUserProfile(user);
    } catch (error) {
      console.error('AuthProvider: Error fetching profile:', error);
    }
  }, [fetchUserProfile]);

  // Set up auth listener only once
  useEffect(() => {
    if (authListenerSet.current) {
      console.log('AuthProvider: Auth listener already set, skipping');
      return;
    }

    console.log('AuthProvider: Setting up auth listener (one time)');
    authListenerSet.current = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session?.user?.id);
      
      // Prevent concurrent processing
      if (isProcessingAuth.current) {
        console.log('AuthProvider: Already processing auth change, skipping');
        return;
      }

      isProcessingAuth.current = true;

      try {
        if (session?.user) {
          // Only fetch profile if the user ID actually changed
          if (lastUserId.current !== session.user.id) {
            console.log('AuthProvider: User changed, fetching new profile');
            lastUserId.current = session.user.id;
            await memoizedFetchUserProfile(session.user);
          } else {
            console.log('AuthProvider: Same user, skipping profile fetch');
          }
        } else {
          console.log('AuthProvider: No session, clearing user');
          lastUserId.current = null;
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('AuthProvider: Error handling auth change:', error);
      } finally {
        isProcessingAuth.current = false;
        if (!isInitialized) {
          console.log('AuthProvider: Setting initialized to true');
          setIsInitialized(true);
        }
      }
    });

    // Get initial session after setting up listener
    const getInitialSession = async () => {
      try {
        console.log('AuthProvider: Getting initial session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('AuthProvider: Found initial session for user:', session.user.id);
          if (lastUserId.current !== session.user.id) {
            lastUserId.current = session.user.id;
            await memoizedFetchUserProfile(session.user);
          }
        } else {
          console.log('AuthProvider: No initial session found');
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('AuthProvider: Error getting initial session:', error);
      } finally {
        if (!isInitialized) {
          console.log('AuthProvider: Setting initialized to true (initial session)');
          setIsInitialized(true);
        }
      }
    };

    getInitialSession();

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
      authListenerSet.current = false;
    };
  }, []); // Empty dependency array - this should only run once

  const logout = useCallback(() => {
    console.log('AuthProvider: Logging out');
    lastUserId.current = null;
    isProcessingAuth.current = true;
    logoutOperation(setCurrentUser);
    setTimeout(() => {
      isProcessingAuth.current = false;
    }, 100);
  }, [logoutOperation, setCurrentUser]);

  const value = {
    currentUser,
    login,
    logout,
    signUp,
    isLoading: isLoading || !isInitialized,
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
