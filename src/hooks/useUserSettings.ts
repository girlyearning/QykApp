import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  selected_note_folder?: string;
  selected_entry_folder?: string;
  selected_confession_folder?: string;
  theme?: string;
}

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSettings = async () => {
    if (!user) {
      setSettings({});
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setSettings(data || {});
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      // Don't show toast for initial load errors, just use defaults
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          ...newSettings,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      setSettings(prev => ({ ...prev, ...newSettings }));
      return true;
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
      return false;
    }
  };

  const getSelectedFolder = (section: 'note' | 'entry' | 'confession'): string => {
    switch (section) {
      case 'note':
        return settings.selected_note_folder || '';
      case 'entry':
        return settings.selected_entry_folder || '';
      case 'confession':
        return settings.selected_confession_folder || '';
      default:
        return '';
    }
  };

  const setSelectedFolder = async (section: 'note' | 'entry' | 'confession', folder: string) => {
    const updateKey = `selected_${section}_folder` as keyof UserSettings;
    return await updateSettings({ [updateKey]: folder });
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return {
    settings,
    loading,
    updateSettings,
    getSelectedFolder,
    setSelectedFolder,
    refetch: fetchSettings,
  };
};