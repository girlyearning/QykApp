import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserSettings } from "@/hooks/useUserSettings";
import { ChevronRight, LogOut, StickyNote, BookOpen, Lock } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { useNotes, useEntries, useConfessions } from "@/hooks/useSupabaseData";
import { useQykStats } from "@/hooks/useQykStats";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";

const Settings = () => {
  const { theme } = useTheme();
  const { signOut, user } = useAuth();
  const { profile, displayName: profileDisplayName, updateProfile } = useProfile();
  const { settings: userSettings, updateSettings } = useUserSettings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const handleRefresh = () => {
    // Force a soft reload to apply global font size classes
    window.location.reload();
  };

  // QykStats data sources and persistence
  const { notes } = useNotes();
  const { entries } = useEntries();
  const { confessions } = useConfessions();
  const { backfillFromItems, getCurrentWeekSeries, getCurrentWeekAverages } = useQykStats();

  // Backfill persisted stats from fetched items for the current week
  const now = new Date();
  const sunday = new Date(now);
  sunday.setHours(0,0,0,0);
  sunday.setDate(sunday.getDate() - sunday.getDay()); // Sunday start
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  useEffect(() => {
    backfillFromItems(notes, 'notes', sunday, saturday);
  }, [notes.length]);
  useEffect(() => {
    backfillFromItems(entries, 'entries', sunday, saturday);
  }, [entries.length]);
  useEffect(() => {
    backfillFromItems(confessions, 'confessions', sunday, saturday);
  }, [confessions.length]);

  const series = getCurrentWeekSeries();
  const { notesAvg, entriesAvg, confessionsAvg } = getCurrentWeekAverages();

  // Align Y-axis numbers center under the "Notes" legend label
  const notesLegendRef = useRef<HTMLDivElement | null>(null);
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);
  const [chartLeftOffset, setChartLeftOffset] = useState<number>(0);

  useEffect(() => {
    const Y_AXIS_WIDTH = 44; // keep in sync with <YAxis width={44} />
    const computeOffset = () => {
      const notesEl = notesLegendRef.current;
      const chartWrapEl = chartWrapperRef.current;
      if (!notesEl || !chartWrapEl) return;
      const notesRect = notesEl.getBoundingClientRect();
      const wrapRect = chartWrapEl.getBoundingClientRect();
      const desiredCenter = notesRect.left + notesRect.width / 2;
      const yAxisCenter = wrapRect.left + Y_AXIS_WIDTH / 2;
      const delta = Math.round(desiredCenter - yAxisCenter);
      setChartLeftOffset(delta);
    };
    computeOffset();
    window.addEventListener('resize', computeOffset);
    return () => window.removeEventListener('resize', computeOffset);
  }, []);

  const handleDisplayNameUpdate = async () => {
    if (displayName.trim() === profile?.display_name) return;
    
    setIsUpdating(true);
    try {
      await updateProfile({ display_name: displayName.trim() });
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const themeDisplay: Record<Theme, { name: string; preview: string }> = {
    light: { name: 'Light Mode', preview: 'bg-slate-100 border-slate-300' },
    dark: { name: 'Midnight Mode', preview: 'bg-slate-800 border-slate-600' },
    blackout: { name: 'BlackOut', preview: 'bg-black border-neutral-800' },
    'pink-blackout': { name: 'Pink BlackOut', preview: 'bg-black border-pink-500 ring-1 ring-pink-400' },
    pink: { name: 'Pink Bliss', preview: 'bg-pink-100 border-pink-300' },
    'hot-pink-paradise': { name: 'Hot Pink Paradise', preview: 'bg-gradient-to-br from-pink-300 via-pink-200 to-green-200 border-2 border-pink-400 shadow-sm' },
    iridescent: { name: 'Iridescent Dreams', preview: 'bg-purple-100 border-purple-300' },
    'lime-green': { name: 'Lime Green', preview: 'bg-lime-300 border-lime-500' },
    'baby-blue': { name: 'Baby Blue', preview: 'bg-sky-200 border-sky-400' },
    'dark-purple': { name: 'Dark Purple', preview: 'bg-purple-600 border-purple-400' },
    'dark-purple-night': { name: 'Dark Purple Night', preview: 'bg-black border-purple-700 ring-1 ring-purple-500' },
    'coffee-core': { name: 'Coffee Core', preview: 'bg-[hsl(40,50%,95%)] border-[hsl(35,30%,85%)]' },
  };

  // Update displayName when profile changes
  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    } else if (profileDisplayName) {
      setDisplayName(profileDisplayName);
    }
  }, [profile?.display_name, profileDisplayName]);

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Modern Title Widget */}
        <div className="pt-safe pl-safe pr-safe">
          <ModernTitleWidget
            title="Settings"
            description="Customize your QYK experience"
            canGoBack={true}
            backRoute="/"
          />
        </div>

        {/* Authentication */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-display font-condensed">Account</CardTitle>
            <CardDescription className="font-condensed">
              Manage your account and sign out
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="space-y-4 font-condensed">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email</span>
                <span className="text-sm">{user?.email}</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    className="rounded-2xl"
                  />
                  <Button
                    onClick={handleDisplayNameUpdate}
                    disabled={isUpdating || displayName.trim() === profile?.display_name}
                    className="rounded-2xl"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full rounded-2xl font-condensed hover-lift"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* QykStats */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-display font-condensed">QykStats</CardTitle>
            <CardDescription className="font-condensed">
              Your daily posts and weekly averages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Legend with icons */}
            <div className="flex items-center gap-4 mb-3 text-xs font-condensed">
              <div ref={notesLegendRef} className="flex items-center gap-1">
                <StickyNote className="w-3.5 h-3.5" style={{ color: '#ec4899' }} />
                <span>Notes</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" style={{ color: '#a855f7' }} />
                <span>Entries</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
                <span>Confessions</span>
              </div>
            </div>
            <div ref={chartWrapperRef} className="w-full" style={{ height: 220, overflow: 'visible', marginLeft: chartLeftOffset }}>
              <ResponsiveContainer debounce={200}>
                <LineChart data={series} margin={{ top: 12, right: 16, bottom: 24, left: 0 }}>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis allowDecimals={false} width={44} tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  {/* Daily lines */}
                  <Line type="monotone" dataKey="notes" stroke="#ec4899" strokeWidth={2} dot={false} name="Notes" />
                  <Line type="monotone" dataKey="entries" stroke="#a855f7" strokeWidth={2} dot={false} name="Entries" />
                  <Line type="monotone" dataKey="confessions" stroke="#6366f1" strokeWidth={2} dot={false} name="Confessions" />
                  {/* Weekly average reference lines */}
                  <ReferenceLine y={Number(notesAvg.toFixed(2))} stroke="#ec4899" strokeDasharray="4 4" ifOverflow="clip" />
                  <ReferenceLine y={Number(entriesAvg.toFixed(2))} stroke="#a855f7" strokeDasharray="4 4" ifOverflow="clip" />
                  <ReferenceLine y={Number(confessionsAvg.toFixed(2))} stroke="#6366f1" strokeDasharray="4 4" ifOverflow="clip" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Theme (compact) */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-display font-condensed">Theme</CardTitle>
            <CardDescription className="font-condensed">
              Select your preferred visual style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className={`w-full justify-between rounded-2xl hover-lift ${theme === 'light' ? '' : ''}`}
              onClick={() => navigate('/settings/theme')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${themeDisplay[theme].preview}`}></div>
                <span className="font-display font-condensed">{themeDisplay[theme].name}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Button>
          </CardContent>
        </Card>

        {/* Favorites section removed per request (feature remains accessible elsewhere) */}

        {/* Font Size (scrollable area) */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-display font-condensed">Font Size</CardTitle>
            <CardDescription className="font-condensed">
              Adjust text size across the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto -mx-2 px-2 pb-1">
              <div className="flex gap-2 min-w-max">
                {([
                  { id: 'small', label: 'Small' },
                  { id: 'default', label: 'Default' },
                  { id: 'large', label: 'Large' },
                  { id: 'xlarge', label: 'Extra Large' },
                ] as const).map((opt) => (
                  <Button
                    key={opt.id}
                    variant={userSettings.font_scale === opt.id ? 'default' : 'outline'}
                    className="rounded-2xl"
                    onClick={() => updateSettings({ font_scale: opt.id })}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full rounded-2xl"
              onClick={handleRefresh}
            >
              Refresh to apply font changes
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-display font-condensed">About QYK</CardTitle>
            <CardDescription className="font-condensed">
              Your personal writing sanctuary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2 font-condensed">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created by</span>
                <span>Vee</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Storage</span>
                <span>Supabase Cloud</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="glass-card p-4 rounded-3xl bg-primary/5 border border-primary/20 animate-scale-in">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-primary font-display font-condensed">Secure & Private</h3>
            <p className="text-xs text-muted-foreground font-condensed">
              Your data is securely stored in the cloud with end-to-end encryption. Only you can access your notes, entries, and confessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;