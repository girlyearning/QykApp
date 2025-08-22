import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StickyNote, BookOpen, Lock, Sparkles } from "lucide-react";

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
      title: "Qykfess",
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
        <div className="text-center space-y-4 pt-safe">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">QYK</h1>
          </div>
          <p className="text-lg text-muted-foreground font-medium">
            Your personal writing sanctuary
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Express yourself through quick notes, detailed entries, or private confessions
          </p>
        </div>

        {/* Service Cards */}
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="glass-card p-6 rounded-3xl hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
              onClick={() => navigate(service.route)}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl bg-muted/50 ${service.color}`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {service.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-4 h-8"
                >
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-foreground mb-4">Today's Writing</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground">Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground">Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground">Confessions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
