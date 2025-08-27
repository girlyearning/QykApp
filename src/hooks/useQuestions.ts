import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface QuestionAnswer {
  id: string;
  content: string;
  question: string;
  question_date: string; // yyyy-mm-dd for the 6am-anchored day
  created_at: string;
  updated_at: string;
}

const STORAGE_SEQ_KEY = 'qyk-questions-seq-v1';
const STORAGE_MAP_KEY = 'qyk-questions-map-v1'; // dayKey -> index

export const DAILY_QUESTIONS: string[] = [
  "What emotions am I most uncomfortable sitting with, and what does that avoidance reveal about me?",
  "In what ways have I been dishonest with myself lately?",
  "How do I behave differently when I feel powerless compared to when I feel in control?",
  "What patterns of self-sabotage do I recognize but continue to repeat?",
  "Which wounds from childhood still quietly dictate my choices today?",
  "What truths about myself do I hope no one else notices?",
  "How do I react when someone challenges my identity or beliefs?",
  "Where in my life am I mistaking comfort for happiness?",
  "What do I sacrifice in order to be liked by others?",
  "When have I betrayed my own boundaries, and why did I do it?",
  "What kind of validation do I crave most, and from whom?",
  "How do I disguise my insecurities in relationships?",
  "What emotions do I weaponize against others?",
  "Where do I confuse attachment with love?",
  "How do I respond when someone sets a boundary with me?",
  "When do I feel most invisible, even among people who know me?",
  "What version of myself do I present publicly that doesn’t match who I am privately?",
  "How do I define “enough,” and why does that standard shift?",
  "What do I envy in others, and what does that envy say about my own desires?",
  "What lies do I tell myself to avoid responsibility?",
  "Where in my life do I mistake intensity for intimacy?",
  "What is my relationship to failure, and how does it shape the risks I take?",
  "Which regrets haunt me most, and what do they reveal about my values?",
  "When has pain taught me something no joy ever could?",
  "What identities or roles do I cling to out of fear of being nothing without them?",
  "How has my definition of “strength” changed over time?",
  "Where am I complicit in the very systems I criticize?",
  "What part of me would I be terrified for others to see unfiltered?",
  "How do I punish myself when I feel I’ve fallen short?",
  "Where do I confuse discipline with self-cruelty?",
  "What does freedom mean to me beyond the absence of restriction?",
  "How do I reconcile the parts of myself that contradict each other?",
  "What illusions of control do I cling to in order to feel safe?",
  "When have I mistaken survival for living?",
  "What secrets shape the way I behave, even if I never share them?",
  "How do I measure my worth, and where did that metric come from?",
  "Which people in my life reflect the best and worst in me?",
  "What lessons have I refused to learn more than once?",
  "Where in my life do I confuse resignation with acceptance?",
  "How do I use busyness as an escape from myself?",
  "What is the cost of staying silent when I want to speak?",
  "How does my culture shape what I consider “normal,” and do I agree with it?",
  "When do I feel most estranged from humanity as a whole?",
  "How does shame show up in my body?",
  "What fears govern my choices more than I admit?",
  "When do I find myself mimicking others just to belong?",
  "What stories from my past have I rewritten to make them easier to live with?",
  "What forms of love have I rejected without realizing?",
  "How do I confuse punishment with justice in my own thinking?",
  "Where do I see cycles of generational pain repeating through me?",
  "When do I use humor to hide what I really feel?",
  "What kind of silence feels healing, and what kind feels suffocating?",
  "What do I truly desire when I say I want “peace”?",
  "What part of me most resists change, and why?",
  "When have I feared my own capacity to harm?",
  "How do I use anger — as fuel, as a shield, or as destruction?",
  "What myths about myself do I keep alive out of fear of starting over?",
  "When do I confuse loyalty with self-betrayal?",
  "What am I most afraid people would say about me if I weren’t in the room?",
  "What does forgiveness actually mean to me, and who have I denied it to?",
  "What do I withhold from others to maintain control?",
  "What have I normalized that actually hurts me?",
  "How do I react when others reflect back a version of me I don’t like?",
  "What does my suffering demand of me — silence, growth, or acknowledgment?",
  "Where in my life do I mistake numbness for healing?",
  "When do I most fear being ordinary?",
  "What illusions about permanence comfort me?",
  "Where do I seek escape instead of presence?",
  "What is the hidden cost of the life I’ve chosen?",
  "How has grief reshaped the architecture of my identity?",
  "Where do I confuse desire with need?",
  "What do I most fear losing control over — my body, my mind, or my image?",
  "How do I interpret suffering — punishment, randomness, or transformation?",
  "What parts of myself would my younger self grieve to see?",
  "What role does guilt play in how I make decisions?",
  "What temptations feel impossible to resist, and why?",
  "When do I mistake chaos for passion?",
  "What do I hope never gets revealed about me?",
  "How do I rationalize actions that go against my own values?",
  "What truths about life do I resist most fiercely?",
  "What would I do differently if I believed nothing mattered in the end?",
  "What do I cling to most tightly out of fear of emptiness?",
  "When have I felt most like a stranger in my own body?",
  "How do I handle the moments when life feels meaningless?",
  "What hidden contracts do I hold with others that they never agreed to?",
  "What philosophies comfort me, and which unsettle me?",
  "When has solitude revealed something I didn’t want to know?",
  "What part of me is most terrified of intimacy?",
  "How do I disguise self-centeredness as morality?",
  "When do I find myself addicted to pain?",
  "What illusions about “good people” do I still cling to?",
  "How do I define dignity for myself?",
  "What role does death play in the way I live?",
  "When do I feel most alien to the world around me?",
  "What do I believe about human nature at its core?",
  "How do I handle the possibility that I may never be understood?",
  "What is the line between acceptance and complacency in my life?",
  "What do I hope endures of me once I am gone?",
  "When do I most fear being forgotten?",
  "How do I know when I am truly alive?",
];

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getAnchoredDayKey(now = new Date()): string {
  const d = new Date(now);
  // if before 6am local, count as previous day
  const boundary = new Date(d);
  boundary.setHours(6, 0, 0, 0);
  if (d < boundary) {
    d.setDate(d.getDate() - 1);
  }
  d.setHours(0, 0, 0, 0);
  return toIsoDate(d);
}

function loadSeq(): number[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_SEQ_KEY);
    return raw ? (JSON.parse(raw) as number[]) : null;
  } catch {
    return null;
  }
}

function saveSeq(seq: number[]) {
  try {
    localStorage.setItem(STORAGE_SEQ_KEY, JSON.stringify(seq));
  } catch {
    // no-op
  }
}

function loadMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_MAP_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function saveMap(map: Record<string, number>) {
  try {
    localStorage.setItem(STORAGE_MAP_KEY, JSON.stringify(map));
  } catch {
    // no-op
  }
}

function fisherYatesShuffle(arr: number[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export const useQuestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Ensure sequence exists
  useEffect(() => {
    let seq = loadSeq();
    if (!seq || seq.length !== DAILY_QUESTIONS.length) {
      seq = Array.from({ length: DAILY_QUESTIONS.length }, (_, i) => i);
      fisherYatesShuffle(seq);
      saveSeq(seq);
    }
  }, []);

  const currentQuestion = useMemo(() => {
    const dayKey = getAnchoredDayKey();
    const map = loadMap();
    if (Object.prototype.hasOwnProperty.call(map, dayKey)) {
      const idx = map[dayKey];
      return { dayKey, index: idx, text: DAILY_QUESTIONS[idx] };
    }
    // assign next unused index if any remain
    const used = new Set(Object.values(map));
    const seq = loadSeq() || Array.from({ length: DAILY_QUESTIONS.length }, (_, i) => i);
    const nextIdx = seq.find(i => !used.has(i));
    if (nextIdx === undefined) {
      // exhausted questions; stick with the last assigned question in map (most recent)
      const keys = Object.keys(map).sort();
      const lastKey = keys[keys.length - 1];
      const idx = lastKey ? map[lastKey] : 0;
      return { dayKey, index: idx, text: DAILY_QUESTIONS[idx] };
    }
    const nextMap = { ...map, [dayKey]: nextIdx };
    saveMap(nextMap);
    return { dayKey, index: nextIdx, text: DAILY_QUESTIONS[nextIdx] };
  }, []);

  const fetchAnswers = async () => {
    if (!user || hasFetched) return;
    try {
      if (answers.length === 0) setLoading(true);
      const { data, error } = await supabase
        .from('question_answers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAnswers((data || []) as unknown as QuestionAnswer[]);
      setHasFetched(true);
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to fetch questions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !hasFetched) fetchAnswers();
    else if (!user) {
      setAnswers([]);
      setLoading(false);
      setHasFetched(false);
    }
  }, [user, hasFetched]);

  const addAnswer = async (content: string) => {
    if (!user) return null;
    try {
      const payload = {
        user_id: user.id,
        content,
        question: currentQuestion.text,
        question_date: currentQuestion.dayKey,
      };
      const { data, error } = await supabase
        .from('question_answers')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      setAnswers(prev => [data as unknown as QuestionAnswer, ...prev]);
      return data as unknown as QuestionAnswer;
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to add answer', variant: 'destructive' });
      return null;
    }
  };

  const updateAnswer = async (id: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('question_answers')
        .update({ content: newContent })
        .eq('id', id);
      if (error) throw error;
      setAnswers(prev => prev.map(a => (a.id === id ? { ...a, content: newContent } : a)));
      toast({ title: 'Saved', description: 'Answer updated' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update answer', variant: 'destructive' });
    }
  };

  const deleteAnswer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('question_answers')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setAnswers(prev => prev.filter(a => a.id !== id));
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to delete answer', variant: 'destructive' });
    }
  };

  const todaysAnsweredCount = useMemo(() => {
    const todayKey = getAnchoredDayKey();
    return answers.filter(a => a.question_date === todayKey).length;
  }, [answers]);

  const todaysAnswer = useMemo(() => {
    const todayKey = getAnchoredDayKey();
    return answers.find(a => a.question_date === todayKey) || null;
  }, [answers]);

  return {
    currentQuestion,
    answers,
    loading,
    addAnswer,
    updateAnswer,
    deleteAnswer,
    refetch: fetchAnswers,
    todaysAnsweredCount,
    todaysAnswer,
  };
};
