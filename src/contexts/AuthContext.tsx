
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  
  // Use ref to prevent multiple auth setup
  const authInitialized = useRef(false);

  console.log('AuthProvider render - isLoading:', isLoading, 'user:', !!user, 'profile:', !!profile);

  // Fetch user profile function
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        console.log('Profile fetched successfully:', profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error in profile fetch:', error);
      setProfile(null);
    }
  };

  // Setup auth only once
  useEffect(() => {
    if (authInitialized.current) {
      console.log('Auth already initialized, skipping');
      return;
    }

    console.log('Initializing auth for the first time');
    authInitialized.current = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'session exists:', !!session);
      
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch profile when user signs in
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setIsLoading(false);
          return;
        }

        console.log('Initial session retrieved:', !!session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Cleanup function
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once

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
