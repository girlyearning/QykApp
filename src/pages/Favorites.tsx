import { useMemo, type CSSProperties } from 'react';
import { ModernTitleWidget } from '@/components/ModernTitleWidget';
import { ContentCard } from '@/components/ContentCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useNotes, useEntries, useConfessions } from '@/hooks/useSupabaseData';
import { useQuestions } from '@/hooks/useQuestions';
import { useAuth } from '@/contexts/AuthContext';

const Favorites = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { notes, deleteNote } = useNotes();
  const { entries, deleteEntry } = useEntries();
  const { confessions, deleteConfession } = useConfessions();
  const { answers, updateAnswer, deleteAnswer } = useQuestions();
  const { removeFavorite } = useFavorites();

  const items = useMemo(() => {
    return favorites.map(f => {
      if (f.item_type === 'note') {
        const n = notes.find(n => n.id === f.item_id);
        if (!n) return null;
        return {
          fav_id: f.id,
          kind: 'note' as const,
          item_id: n.id,
          title: 'QykNote',
          content: n.content,
          timestamp: n.created_at,
        };
      }
      if (f.item_type === 'entry') {
        const e = entries.find(e => e.id === f.item_id);
        if (!e) return null;
        return {
          fav_id: f.id,
          kind: 'entry' as const,
          item_id: e.id,
          title: e.title || 'Entry',
          content: e.content,
          timestamp: e.created_at,
        };
      }
      if (f.item_type === 'confession') {
        const c = confessions.find(c => c.id === f.item_id);
        if (!c) return null;
        return {
          fav_id: f.id,
          kind: 'confession' as const,
          item_id: c.id,
          title: 'QykFess',
          content: c.content,
          timestamp: c.created_at,
        };
      }
      if (f.item_type === 'question') {
        const a = answers.find(a => a.id === f.item_id);
        if (!a) return null;
        // Title shows the daily question and the date
        const date = new Date(a.question_date);
        const formatted = date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
        return {
          fav_id: f.id,
          kind: 'question' as const,
          item_id: a.id,
          title: `${a.question} — ${formatted}`,
          content: a.content,
          timestamp: a.created_at,
        };
      }
      return null;
    }).filter(Boolean) as Array<{ fav_id: string; kind: 'note'|'entry'|'confession'|'question'; item_id: string; title: string; content: string; timestamp: string; }>;
  }, [favorites, notes, entries, confessions, answers]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
        <div className="max-w-2xl mx-auto">
          <ModernTitleWidget title="Favorites" description="Sign in to view favorites" canGoBack backRoute="/" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="pt-safe pl-safe pr-safe">
          <ModernTitleWidget title="Favorites" description="Your saved posts" canGoBack backRoute="/" />
        </div>
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground font-condensed py-12">No favorites yet.</div>
          ) : (
            items.map((it, idx) => (
              <div key={`${it.kind}-${it.item_id}`} style={{ '--stagger-delay': idx } as CSSProperties} className="animate-slide-up">
                <ContentCard
                  title={it.title}
                  content={it.content}
                  timestamp={new Date(it.timestamp)}
                  onDelete={() => {
                    if (it.kind === 'question') {
                      deleteAnswer(it.item_id);
                    } else if (it.kind === 'note') {
                      deleteNote(it.item_id);
                    } else if (it.kind === 'entry') {
                      deleteEntry(it.item_id);
                    } else if (it.kind === 'confession') {
                      deleteConfession(it.item_id);
                    }
                  }}
                  type={it.kind === 'entry' ? 'entry' : it.kind === 'confession' ? 'confession' : 'note'}
                  onRemoveFavorite={() => removeFavorite(it.kind as any, it.item_id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
