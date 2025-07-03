
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../types/auth';

export const useUserProfile = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchUserProfile = useCallback(async (user: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          username: profile.email.split('@')[0], // Use email prefix as username
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: profile.email,
          role: profile.role as 'admin' | 'lecturer' | 'student'
        };
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }, []);

  return {
    currentUser,
    setCurrentUser,
    fetchUserProfile
  };
};
