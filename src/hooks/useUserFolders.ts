import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type SectionType = 'note' | 'entry' | 'confession' | 'pic';

export const useUserFolders = (section: SectionType) => {
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFolders = async () => {
    if (!user) {
      setFolders([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_folders')
        .select('folder_name')
        .eq('user_id', user.id)
        .eq('section', section)
        .order('folder_name');

      if (error) throw error;
      setFolders(data?.map(f => f.folder_name) || []);
    } catch (error: any) {
      console.error('Error fetching folders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch folders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFolder = async (folderName: string) => {
    if (!user || folders.includes(folderName)) return false;

    try {
      const { error } = await supabase
        .from('user_folders')
        .insert({
          user_id: user.id,
          section,
          folder_name: folderName,
        });

      if (error) throw error;
      setFolders(prev => [...prev, folderName].sort());
      return true;
    } catch (error: any) {
      console.error('Error adding folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeFolder = async (folderName: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_folders')
        .delete()
        .eq('user_id', user.id)
        .eq('section', section)
        .eq('folder_name', folderName);

      if (error) throw error;
      setFolders(prev => prev.filter(f => f !== folderName));
      return true;
    } catch (error: any) {
      console.error('Error removing folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      });
      return false;
    }
  };

  const renameFolder = async (oldName: string, newName: string) => {
    if (!user || !oldName || !newName || oldName === newName) return false;
    try {
      const { error } = await supabase
        .from('user_folders')
        .update({ folder_name: newName })
        .eq('user_id', user.id)
        .eq('section', section)
        .eq('folder_name', oldName);
      if (error) throw error;
      setFolders(prev => prev.map(f => (f === oldName ? newName : f)).sort());
      return true;
    } catch (error: any) {
      console.error('Error renaming folder:', error);
      toast({ title: 'Error', description: 'Failed to rename folder', variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [user, section]);

  return {
    folders,
    loading,
    addFolder,
    removeFolder,
    renameFolder,
    refetch: fetchFolders,
  };
};