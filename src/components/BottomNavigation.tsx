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
      label: "Qykfess",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="glass-card mx-4 mb-4 rounded-3xl p-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-6 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;