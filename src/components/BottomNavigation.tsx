import { NavLink } from "react-router-dom";
import { StickyNote, BookOpen, Lock } from "lucide-react";

const BottomNavigation = () => {
  const navItems = [
    {
      to: "/qyknote",
      icon: StickyNote,
      label: "QykNote",
    },
    {
      to: "/qykwrite", 
      icon: BookOpen,
      label: "QykWrite",
    },
    {
      to: "/qykfess",
      icon: Lock,
      label: "QykFess",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe animate-slide-up">
      <div className="glass-card mx-4 mb-4 rounded-3xl p-2 animate-fade-in">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={{ '--stagger-delay': index } as React.CSSProperties}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-6 py-3 rounded-2xl transition-all duration-300 hover-lift animate-bounce-in ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium font-overused font-condensed">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;