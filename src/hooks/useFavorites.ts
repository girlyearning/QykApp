import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type FavoriteKind = 'note' | 'entry' | 'confession' | 'question';

export interface FavoriteRow {
  id: string;
  user_id: string;
  item_type: FavoriteKind;
  item_id: string;
  created_at: string;
  updated_at: string;
}

export interface FavoriteItem {
  fav_id: string;
  kind: FavoriteKind;
  item_id: string;
  created_at: string;
  title: string;
  content: string;
  timestamp: string;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchFavorites = async () => {
    if (!user || hasFetched) return;
    try {
      if (favorites.length === 0) setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setFavorites((data || []) as unknown as FavoriteRow[]);
      setHasFetched(true);
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to fetch favorites', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !hasFetched) fetchFavorites();
    else if (!user) {
      setFavorites([]);
      setLoading(false);
      setHasFetched(false);
    }
  }, [user, hasFetched]);

  const isFavorited = (kind: FavoriteKind, itemId: string) =>
    favorites.some(f => f.item_type === kind && f.item_id === itemId);

  const addFavorite = async (kind: FavoriteKind, itemId: string) => {
    if (!user) return null;
    try {
      // avoid dupes
      if (isFavorited(kind, itemId)) return favorites.find(f => f.item_type === kind && f.item_id === itemId) || null;
      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, item_type: kind, item_id: itemId })
        .select()
        .single();
      if (error) throw error;
      setFavorites(prev => [data as any as FavoriteRow, ...prev]);
      toast({ title: 'Added', description: 'Added to Favorites' });
      return data as any as FavoriteRow;
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to add favorite', variant: 'destructive' });
      return null;
    }
  };

  const removeFavorite = async (kind: FavoriteKind, itemId: string) => {
    try {
      const existing = favorites.find(f => f.item_type === kind && f.item_id === itemId);
      if (!existing) return;
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
      setFavorites(prev => prev.filter(f => f.id !== existing.id));
      toast({ title: 'Removed', description: 'Removed from Favorites' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to remove favorite', variant: 'destructive' });
    }
  };

  return { favorites, loading, addFavorite, removeFavorite, isFavorited, refetch: fetchFavorites };
}
