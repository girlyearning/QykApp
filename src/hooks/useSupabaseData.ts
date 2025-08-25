import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  content: string;
  folder?: string;
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: string;
  title?: string;
  content: string;
  folder?: string;
  created_at: string;
  updated_at: string;
}

export interface Confession {
  id: string;
  content: string;
  folder?: string;
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (content: string, folder?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          content,
          folder,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const moveNote = async (id: string, newFolder: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ folder: newFolder || null })
        .eq('id', id);

      if (error) throw error;
      setNotes(prev => 
        prev.map(note => 
          note.id === id ? { ...note, folder: newFolder || undefined } : note
        )
      );
      toast({
        title: "Success",
        description: `Note moved to ${newFolder || 'main folder'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to move note",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  return { notes, loading, addNote, deleteNote, moveNote, refetch: fetchNotes };
};

export const useEntries = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (content: string, title?: string, folder?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('entries')
        .insert({
          content,
          title,
          folder,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setEntries(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add entry",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    }
  };

  const moveEntry = async (id: string, newFolder: string) => {
    try {
      const { error } = await supabase
        .from('entries')
        .update({ folder: newFolder || null })
        .eq('id', id);

      if (error) throw error;
      setEntries(prev => 
        prev.map(entry => 
          entry.id === id ? { ...entry, folder: newFolder || undefined } : entry
        )
      );
      toast({
        title: "Success",
        description: `Entry moved to ${newFolder || 'main folder'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to move entry",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  return { entries, loading, addEntry, deleteEntry, moveEntry, refetch: fetchEntries };
};

export const useConfessions = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConfessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfessions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch confessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addConfession = async (content: string, folder?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('confessions')
        .insert({
          content,
          folder,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setConfessions(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add confession",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteConfession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('confessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setConfessions(prev => prev.filter(confession => confession.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete confession",
        variant: "destructive",
      });
    }
  };

  const moveConfession = async (id: string, newFolder: string) => {
    try {
      const { error } = await supabase
        .from('confessions')
        .update({ folder: newFolder || null })
        .eq('id', id);

      if (error) throw error;
      setConfessions(prev => 
        prev.map(confession => 
          confession.id === id ? { ...confession, folder: newFolder || undefined } : confession
        )
      );
      toast({
        title: "Success",
        description: `Confession moved to ${newFolder || 'main folder'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to move confession",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchConfessions();
    }
  }, [user]);

  return { confessions, loading, addConfession, deleteConfession, moveConfession, refetch: fetchConfessions };
};