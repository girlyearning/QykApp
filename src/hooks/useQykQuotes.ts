import { useEffect, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { QykQuotes, QykQuotesState } from '@/lib/qykQuotes';

const STORAGE_KEY = 'qyk_quotes_state';

type LocalState = QykQuotesState & { hour: number; minute: number };

const readLocal = (): LocalState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.hour === 'number' && typeof parsed.minute === 'number') {
        return {
          enabled: !!parsed.enabled,
          hour: parsed.hour,
          minute: parsed.minute,
        };
      }
    }
  } catch {}
  return { enabled: false, hour: 9, minute: 0 };
};

const writeLocal = (state: LocalState) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

export const useQykQuotes = () => {
  const [state, setState] = useState<LocalState>(readLocal());
  const isAndroid = Capacitor.getPlatform() === 'android';

  // Sync from native (if available)
  useEffect(() => {
    let canceled = false;
    (async () => {
      if (!isAndroid) return;
      try {
        const native = await QykQuotes.getState();
        if (!canceled && native) {
          const merged: LocalState = {
            enabled: !!native.enabled,
            hour: typeof native.hour === 'number' ? native.hour : state.hour,
            minute: typeof native.minute === 'number' ? native.minute : state.minute,
          };
          setState(merged);
          writeLocal(merged);
        }
      } catch {}
    })();
    return () => { canceled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestPermissions = useCallback(async () => {
    try { await QykQuotes.requestPermissions(); } catch {}
  }, []);

  const setEnabled = useCallback(async (enabled: boolean) => {
    const next: LocalState = { ...state, enabled };
    setState(next);
    writeLocal(next);
    try {
      if (enabled) {
        await QykQuotes.scheduleDailyQuote({ hour: next.hour, minute: next.minute });
      } else {
        await QykQuotes.cancelDailyQuote();
      }
    } catch {}
  }, [state]);

  const setTime = useCallback(async (hour: number, minute: number) => {
    const next: LocalState = { ...state, hour, minute };
    setState(next);
    writeLocal(next);
    try {
      if (state.enabled) {
        await QykQuotes.scheduleDailyQuote({ hour, minute });
      }
    } catch {}
  }, [state]);

  return {
    enabled: state.enabled,
    hour: state.hour,
    minute: state.minute,
    requestPermissions,
    setEnabled,
    setTime,
  };
};
