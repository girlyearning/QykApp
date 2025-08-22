import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";

interface ContentCardProps {
  title: string;
  content: string;
  timestamp: Date;
  onDelete: () => void;
  type: "note" | "entry" | "confession";
}

const ContentCard = ({ title, content, timestamp, onDelete, type }: ContentCardProps) => {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const truncateContent = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getDisplayContent = () => {
    switch (type) {
      case "note":
        return content;
      case "entry":
        return truncateContent(content, 150);
      case "confession":
        return content;
      default:
        return content;
    }
  };

  return (
    <div className="glass-card p-4 rounded-2xl group hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-foreground text-sm mb-1">{title}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatTimestamp(timestamp)}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="text-sm text-foreground/90 leading-relaxed">
        {getDisplayContent()}
      </div>
    </div>
  );
};

export { ContentCard };