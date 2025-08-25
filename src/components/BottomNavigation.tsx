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
          {navItems.map((item, index) => {})}
        </div>
      </div>
    </nav>;
};
export default BottomNavigation;