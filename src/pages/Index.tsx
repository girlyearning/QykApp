import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StickyNote, BookOpen, Lock, Sparkles, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "QykNote",
      description: "Quick 200-character thoughts",
      icon: StickyNote,
      route: "/qyknote",
      color: "text-pink-600",
    },
    {
      title: "QykWrite", 
      description: "Long-form journal entries",
      icon: BookOpen,
      route: "/qykwrite",
      color: "text-purple-600",
    },
    {
      title: "QykFess",
      description: "Private confessions (350 chars)",
      icon: Lock,
      route: "/qykfess", 
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
          <p className="text-lg text-muted-foreground font-medium font-overused font-condensed">
            Your personal writing sanctuary
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-overused font-condensed">
            Express yourself through quick notes, detailed entries, or private confessions
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
                  <p className="text-sm text-muted-foreground font-medium font-overused font-condensed">
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
              <div className="text-2xl font-bold text-primary font-space">0</div>
              <div className="text-xs text-muted-foreground font-overused font-condensed">Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-space">0</div>
              <div className="text-xs text-muted-foreground font-overused font-condensed">Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-space">0</div>
              <div className="text-xs text-muted-foreground font-overused font-condensed">Confessions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
