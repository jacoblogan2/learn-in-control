
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'student' | 'lecturer';
  registration_number?: string;
  phone?: string;
  address?: string;
  profile_photo_url?: string;
  language_preference?: string;
  theme_preference?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: { first_name: string; last_name: string; role: 'student' | 'lecturer' }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isStudent: boolean;
  isLecturer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Use refs to track previous values and prevent unnecessary updates
  const prevUserRef = useRef<User | null>(null);
  const prevSessionRef = useRef<Session | null>(null);
  const authListenerRef = useRef<any>(null);
  const mountedRef = useRef(true);

  console.log('AuthProvider render - isLoading:', isLoading, 'user:', !!user, 'profile:', !!profile);

  // Memoized profile fetch function
  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!mountedRef.current) return;
    
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (mountedRef.current) {
          setProfile(null);
        }
      } else {
        console.log('Profile fetched successfully:', profileData);
        if (mountedRef.current) {
          setProfile(profileData);
        }
      }
    } catch (error) {
      console.error('Error in profile fetch:', error);
      if (mountedRef.current) {
        setProfile(null);
      }
    }
  }, []);

  // Helper function to safely update user state only if changed
  const updateUserState = useCallback((newUser: User | null, newSession: Session | null) => {
    if (!mountedRef.current) return;

    console.log('updateUserState called with user:', !!newUser, 'session:', !!newSession);

    // Only update user if it actually changed
    const userChanged = JSON.stringify(prevUserRef.current) !== JSON.stringify(newUser);
    const sessionChanged = JSON.stringify(prevSessionRef.current) !== JSON.stringify(newSession);

    if (sessionChanged) {
      console.log('Session changed, updating state');
      prevSessionRef.current = newSession;
      setSession(newSession);
    }

    if (userChanged) {
      console.log('User changed, updating state');
      prevUserRef.current = newUser;
      setUser(newUser);

      // Fetch profile only when user actually changes
      if (newUser) {
        fetchUserProfile(newUser.id);
      } else {
        setProfile(null);
      }
    }

    setIsLoading(false);
  }, [fetchUserProfile]);

  // Setup auth listener only once
  useEffect(() => {
    console.log('Setting up auth - useEffect triggered');
    
    if (authListenerRef.current) {
      console.log('Auth listener already exists, skipping setup');
      return;
    }

    mountedRef.current = true;

    // Set up auth state listener
    console.log('Creating new auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, 'session exists:', !!session);
      
      if (!mountedRef.current) {
        console.log('Component unmounted, ignoring auth state change');
        return;
      }

      updateUserState(session?.user ?? null, session);
    });

    authListenerRef.current = subscription;

    // Get initial session only once
    const initializeAuth = async () => {
      try {
        console.log('Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mountedRef.current) {
            setIsLoading(false);
          }
          return;
        }

        console.log('Initial session retrieved:', !!session);
        if (mountedRef.current) {
          updateUserState(session?.user ?? null, session);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      console.log('Cleaning up auth context');
      mountedRef.current = false;
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
    };
  }, []); // Empty dependency array - this should only run once

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data.user) {
        console.log('Sign in successful');
        toast({
          title: 'Success',
          description: 'Signed in successfully!',
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error: { message: errorMessage } };
    }
  };

  const signUp = async (email: string, password: string, userData: { first_name: string; last_name: string; role: 'student' | 'lecturer' }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Account created successfully! Please check your email to confirm your account.',
        });
      }

      return { error };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        toast({
          title: 'Success',
          description: 'Signed out successfully!',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during sign out',
        variant: 'destructive',
      });
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isStudent = profile?.role === 'student';
  const isLecturer = profile?.role === 'lecturer';

  const value = {
    user,
    session,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isStudent,
    isLecturer,
  };

  console.log('Auth context state:', { user: !!user, profile: !!profile, isLoading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
