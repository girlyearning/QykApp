import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type QykMetricKind = 'notes' | 'entries' | 'confessions';

export interface QykDailyCounts {
  notes: number;
  entries: number;
  confessions: number;
}

export type QykDailyStats = Record<string /* yyyy-mm-dd */, QykDailyCounts>;

const STORAGE_PREFIX = 'qyk-stats';

function toIsoLocal(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfWeekSunday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function emptyCounts(): QykDailyCounts {
  return { notes: 0, entries: 0, confessions: 0 };
}

export const useQykStats = () => {
  const { user } = useAuth();
  const storageKey = useMemo(() => `${STORAGE_PREFIX}:${user?.id ?? 'anon'}`, [user?.id]);
  const [stats, setStats] = useState<QykDailyStats>({});

  // Load from storage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      setStats(raw ? (JSON.parse(raw) as QykDailyStats) : {});
    } catch {
      setStats({});
    }
  }, [storageKey]);

  // Persist
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [storageKey, stats]);

  const incrementToday = (kind: QykMetricKind) => {
    const todayIso = toIsoLocal(new Date());
    setStats(prev => {
      const current = { ...(prev[todayIso] ?? emptyCounts()) };
      current[kind] = (current[kind] ?? 0) + 1;
      return { ...prev, [todayIso]: current };
    });
  };

  const setDayCount = (isoDate: string, counts: Partial<QykDailyCounts>) => {
    setStats(prev => ({
      ...prev,
      [isoDate]: { ...(prev[isoDate] ?? emptyCounts()), ...counts },
    }));
  };

  type Item = { created_at: string };

  const backfillFromItems = (
    items: Item[],
    kind: QykMetricKind,
    from: Date,
    to: Date
  ) => {
    // Build map of counts for specified range [from, to] inclusive
    const map: Record<string, number> = {};
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setHours(0, 0, 0, 0);

    for (const it of items) {
      const d = new Date(it.created_at);
      d.setHours(0, 0, 0, 0);
      if (d >= start && d <= end) {
        const key = toIsoLocal(d);
        map[key] = (map[key] ?? 0) + 1;
      }
    }

    setStats(prev => {
      const next: QykDailyStats = { ...prev };
      let cursor = new Date(start);
      while (cursor <= end) {
        const key = toIsoLocal(cursor);
        const existing = next[key] ?? emptyCounts();
        const value = map[key] ?? 0;
        next[key] = { ...existing, [kind]: value } as QykDailyCounts;
        cursor = addDays(cursor, 1);
      }
      return next;
    });
  };

  const getCurrentWeekSeries = () => {
    const start = startOfWeekSunday(new Date());
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(start, i);
      const iso = toIsoLocal(d);
      const c = stats[iso] ?? emptyCounts();
      return {
        iso,
        label: labels[i],
        notes: c.notes || 0,
        entries: c.entries || 0,
        confessions: c.confessions || 0,
      };
    });
  };

  const getCurrentWeekAverages = () => {
    const series = getCurrentWeekSeries();
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
    return {
      notesAvg: avg(series.map(s => s.notes)),
      entriesAvg: avg(series.map(s => s.entries)),
      confessionsAvg: avg(series.map(s => s.confessions)),
    };
  };

  return {
    stats,
    incrementToday,
    setDayCount,
    backfillFromItems,
    getCurrentWeekSeries,
    getCurrentWeekAverages,
  };
};
