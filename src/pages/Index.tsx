import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StickyNote, BookOpen, Lock, Sparkles, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNotes, useEntries, useConfessions } from "@/hooks/useSupabaseData";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { notes } = useNotes();
  const { entries } = useEntries();
  const { confessions } = useConfessions();

  // Get today's counts
  const today = new Date().toDateString();
  const todaysNotes = notes.filter(note => 
    new Date(note.created_at).toDateString() === today
  ).length;
  const todaysEntries = entries.filter(entry => 
    new Date(entry.created_at).toDateString() === today
  ).length;
  const todaysConfessions = confessions.filter(confession => 
    new Date(confession.created_at).toDateString() === today
  ).length;

  const services = [
    {
      title: "QykNote",
      description: "Quick 200-character thoughts",
      icon: StickyNote,
      route: "/qyk-note",
      color: "text-pink-600",
    },
    {
      title: "QykWrite", 
      description: "Long-form journal entries",
      icon: BookOpen,
      route: "/qyk-write",
      color: "text-purple-600",
    },
    {
      title: "QykFess",
      description: "Private confessions (350 chars)",
      icon: Lock,
      route: "/qyk-fess", 
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-safe animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
              <h1 className="text-4xl font-bold text-primary font-space font-extra-condensed">QYK</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="rounded-full p-2 hover-lift mt-safe"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-lg text-muted-foreground font-medium font-condensed">
            Welcome back, {profile?.display_name || user?.email?.split('@')[0]}!
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-condensed">
            Your personal writing sanctuary in the cloud
          </p>
        </div>

        {/* Service Cards */}
        <div className="space-y-4 stagger-animation">
          {services.map((service, index) => (
            <div
              key={service.title}
              style={{ '--stagger-delay': index } as React.CSSProperties}
              className="glass-card p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 cursor-pointer hover-lift animate-slide-up"
              onClick={() => navigate(service.route)}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl bg-muted/50 ${service.color} animate-bounce-in`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground font-space font-condensed">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium font-condensed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-6 rounded-3xl animate-scale-in">
          <h3 className="text-lg font-bold text-foreground mb-4 font-space font-condensed">Today's Writing</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-space">{todaysNotes}</div>
              <div className="text-xs text-muted-foreground font-condensed">Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-space">{todaysEntries}</div>
              <div className="text-xs text-muted-foreground font-condensed">Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-space">{todaysConfessions}</div>
              <div className="text-xs text-muted-foreground font-condensed">Confessions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
