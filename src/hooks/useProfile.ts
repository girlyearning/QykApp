import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  // Set initial display name to prevent flash
  useEffect(() => {
    if (user) {
      // Use profile display_name if available, otherwise use email prefix without showing email
      const emailPrefix = user.email?.split('@')[0] || '';
      setDisplayName(emailPrefix);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
      // Update display name only if profile has a display_name
      if (data?.display_name) {
        setDisplayName(data.display_name);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: { display_name?: string }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            user_id: user.id,
            ...updates,
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      if (data?.display_name) {
        setDisplayName(data.display_name);
      }
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    displayName,
    updateProfile,
    refetch: fetchProfile,
  };
};