import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { StickyNote, BookOpen, Lock, Zap, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNotes, useEntries, useConfessions } from "@/hooks/useSupabaseData";
const Index = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    profile,
    displayName
  } = useProfile();
  const {
    notes
  } = useNotes();
  const {
    entries
  } = useEntries();
  const {
    confessions
  } = useConfessions();

  // Get today's counts
  const today = new Date().toDateString();
  const todaysNotes = notes.filter(note => new Date(note.created_at).toDateString() === today).length;
  const todaysEntries = entries.filter(entry => new Date(entry.created_at).toDateString() === today).length;
  const todaysConfessions = confessions.filter(confession => new Date(confession.created_at).toDateString() === today).length;
  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Main Header */}
          <div className="text-center space-y-4 pt-safe animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold text-primary font-space font-extra-condensed">QYK</h1>
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-lg text-muted-foreground font-medium font-condensed">
              Your personal writing sanctuary
            </p>
            <p className="text-sm text-muted-foreground font-medium font-condensed">
              Sign in to sync your data across all devices
            </p>
          </div>

          {/* Sign In Card */}
          <div className="glass-card p-8 rounded-3xl text-center animate-slide-up">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-4 font-space font-condensed">
              Sign In Required
            </h2>
            <p className="text-muted-foreground font-condensed mb-6">
              Access QykNote, QykFess, and QykWrite with cloud sync
            </p>
            <Button onClick={() => navigate('/auth')} className="rounded-full px-8 py-3 text-lg">
              Sign In / Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const services = [{
    title: "QykNote",
    description: "Low-effort, 200-character thoughts",
    icon: StickyNote,
    route: "/qyk-note",
    color: "text-pink-600",
    count: notes.length
  }, {
    title: "QykFess",
    description: "Private 350-character confessions",
    icon: Lock,
    route: "/qyk-fess",
    color: "text-indigo-600",
    count: confessions.length
  }, {
    title: "QykWrite",
    description: "Long-form journal entries",
    icon: BookOpen,
    route: "/qyk-write",
    color: "text-purple-600",
    count: entries.length
  }];
  return <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Main Header */}
        <div className="text-center space-y-4 pt-safe animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold text-primary font-space font-extra-condensed">QYK</h1>
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="absolute top-safe right-4 rounded-full p-2 hover-lift">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-lg text-muted-foreground font-medium font-condensed">
            Welcome back, {profile?.display_name || displayName}!
          </p>
          <p className="text-sm text-muted-foreground font-medium font-condensed">
            Your personal writing sanctuary
          </p>
        </div>

        {/* Today's Writing Stats */}
        <div className="glass-card p-6 rounded-3xl animate-scale-in">
          <h3 className="text-lg font-bold text-foreground mb-4 font-space font-condensed">Today's Writing</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-space">{todaysNotes}</div>
              <div className="text-xs text-muted-foreground font-condensed">Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-space">{todaysConfessions}</div>
              <div className="text-xs text-muted-foreground font-condensed">Confessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-space">{todaysEntries}</div>
              <div className="text-xs text-muted-foreground font-condensed">Entries</div>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="space-y-4 stagger-animation">
          {services.map((service, index) => <div key={service.title} style={{
          '--stagger-delay': index
        } as React.CSSProperties} className="glass-card p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 cursor-pointer hover-lift animate-slide-up" onClick={() => navigate(service.route)}>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl bg-muted/50 ${service.color} animate-bounce-in`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-foreground font-space font-condensed">
                      {service.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs font-condensed px-2 py-1">
                      {service.count}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium font-condensed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default Index;