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
  attachments?: PicAttachmentMeta[];
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
  attachments?: PicAttachmentMeta[];
}

export interface PicAttachmentMeta {
  bucket: string;
  path: string;
  mime?: string;
  size?: number;
  width?: number;
  height?: number;
  uploaded_at?: string;
}

export interface PicPost {
  id: string;
  subtitle?: string | null;
  attachments: PicAttachmentMeta[];
  folder?: string;
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotes = async () => {
    if (!user || hasFetched) return;
    
    try {
      // Only show loading if we don't have any data yet
      if (notes.length === 0) {
        setLoading(true);
      }
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      setHasFetched(true);
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

  const addNote = async (content: string, folder?: string, attachments?: PicAttachmentMeta[]) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          content,
          folder,
          user_id: user.id,
          attachments: attachments || [],
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
    if (user && !hasFetched) {
      fetchNotes();
    } else if (!user) {
      setNotes([]);
      setLoading(false);
      setHasFetched(false);
    }
  }, [user, hasFetched]);

  const refetchNotes = async () => {
    setHasFetched(false);
    await fetchNotes();
  };

  const updateNote = async (id: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ content: newContent })
        .eq('id', id);
      if (error) throw error;
      setNotes(prev => prev.map(n => n.id === id ? { ...n, content: newContent } : n));
      toast({ title: 'Saved', description: 'Note updated' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update note', variant: 'destructive' });
    }
  };

  return { notes, loading, addNote, deleteNote, moveNote, updateNote, refetch: refetchNotes };
};

export const useEntries = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEntries = async () => {
    if (!user || hasFetched) return;
    
    try {
      // Only show loading if we don't have any data yet
      if (entries.length === 0) {
        setLoading(true);
      }
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
      setHasFetched(true);
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
    if (user && !hasFetched) {
      fetchEntries();
    } else if (!user) {
      setEntries([]);
      setLoading(false);
      setHasFetched(false);
    }
  }, [user, hasFetched]);

  const refetchEntries = async () => {
    setHasFetched(false);
    await fetchEntries();
  };

  const updateEntry = async (id: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('entries')
        .update({ content: newContent })
        .eq('id', id);
      if (error) throw error;
      setEntries(prev => prev.map(e => e.id === id ? { ...e, content: newContent } : e));
      toast({ title: 'Saved', description: 'Entry updated' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update entry', variant: 'destructive' });
    }
  };

  return { entries, loading, addEntry, deleteEntry, moveEntry, updateEntry, refetch: refetchEntries };
};

export const useConfessions = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConfessions = async () => {
    if (!user || hasFetched) return;
    
    try {
      // Only show loading if we don't have any data yet
      if (confessions.length === 0) {
        setLoading(true);
      }
      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfessions(data || []);
      setHasFetched(true);
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

  const addConfession = async (content: string, folder?: string, attachments?: PicAttachmentMeta[]) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('confessions')
        .insert({
          content,
          folder,
          user_id: user.id,
          attachments: attachments || [],
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
    if (user && !hasFetched) {
      fetchConfessions();
    } else if (!user) {
      setConfessions([]);
      setLoading(false);
      setHasFetched(false);
    }
  }, [user, hasFetched]);

  const refetchConfessions = async () => {
    setHasFetched(false);
    await fetchConfessions();
  };

  const updateConfession = async (id: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('confessions')
        .update({ content: newContent })
        .eq('id', id);
      if (error) throw error;
      setConfessions(prev => prev.map(c => c.id === id ? { ...c, content: newContent } : c));
      toast({ title: 'Saved', description: 'Confession updated' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update confession', variant: 'destructive' });
    }
  };

  return { confessions, loading, addConfession, deleteConfession, moveConfession, updateConfession, refetch: refetchConfessions };
};

export const usePics = () => {
  const [pics, setPics] = useState<PicPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPics = async () => {
    if (!user || hasFetched) return;
    try {
      if (pics.length === 0) setLoading(true);
      const { data, error } = await supabase
        .from('pics')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPics((data || []) as unknown as PicPost[]);
      setHasFetched(true);
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to fetch pics', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addPic = async (subtitle: string | undefined, attachments: PicAttachmentMeta[], folder?: string) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('pics')
        .insert({ user_id: user.id, subtitle: subtitle || null, attachments, folder })
        .select()
        .single();
      if (error) throw error;
      setPics(prev => [data as unknown as PicPost, ...prev]);
      return data as unknown as PicPost;
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to add pic', variant: 'destructive' });
      return null;
    }
  };

  const deletePic = async (id: string) => {
    try {
      const { error } = await supabase.from('pics').delete().eq('id', id);
      if (error) throw error;
      setPics(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to delete pic', variant: 'destructive' });
    }
  };

  const movePic = async (id: string, newFolder: string) => {
    try {
      const { error } = await supabase.from('pics').update({ folder: newFolder || null }).eq('id', id);
      if (error) throw error;
      setPics(prev => prev.map(p => (p.id === id ? { ...p, folder: newFolder || undefined } : p)));
      toast({ title: 'Success', description: `Pic moved to ${newFolder || 'main folder'}` });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to move pic', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (user && !hasFetched) fetchPics();
    else if (!user) {
      setPics([]);
      setLoading(false);
      setHasFetched(false);
    }
  }, [user, hasFetched]);

  const refetchPics = async () => {
    setHasFetched(false);
    await fetchPics();
  };

  return { pics, loading, addPic, deletePic, movePic, refetch: refetchPics };
};