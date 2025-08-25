import { NavLink } from "react-router-dom";
import { StickyNote, BookOpen, Lock } from "lucide-react";
const BottomNavigation = () => {
  const navItems = [{
    to: "/qyknote",
    icon: StickyNote,
    label: "QykNote"
  }, {
    to: "/qykwrite",
    icon: BookOpen,
    label: "QykWrite"
  }, {
    to: "/qykfess",
    icon: Lock,
    label: "QykFess"
  }];
  return <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe animate-slide-up">
      <div className="glass-card mx-4 mb-4 rounded-3xl p-2 animate-fade-in">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`
              }
            >
              <item.icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>;
};
export default BottomNavigation;