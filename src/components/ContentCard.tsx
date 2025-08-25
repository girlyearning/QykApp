import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { ContentMenu } from "@/components/ContentMenu";
import { FolderTag } from "@/components/FolderTag";
import { MoveToFolderDialog } from "@/components/MoveToFolderDialog";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

interface ContentCardProps {
  title: string;
  content: string;
  timestamp: Date | string;
  onDelete: () => void;
  onMove?: (newFolder: string) => void;
  type: "note" | "entry" | "confession";
  isNew?: boolean;
  folder?: string;
  availableFolders?: string[];
}

const ContentCard = ({ 
  title, 
  content, 
  timestamp, 
  onDelete, 
  onMove,
  type, 
  isNew = false,
  folder,
  availableFolders = []
}: ContentCardProps) => {
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const formatTimestamp = (date: Date | string) => {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
    
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

  const handleMoveToFolder = (newFolder: string) => {
    if (onMove) {
      onMove(newFolder);
    }
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className={`glass-card p-4 rounded-2xl group hover:shadow-md transition-all duration-300 hover-lift animate-scale-in border-2 ${
      isNew ? 'border-primary animate-pulse-glow bg-primary/5' : 'border-primary/60'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center justify-start gap-2 mb-2">
            <h4 className="font-medium text-foreground text-sm font-space font-condensed">{title}</h4>
            {folder && <FolderTag folderName={folder} />}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="font-condensed">{formatTimestamp(timestamp)}</span>
          </div>
        </div>
        <ContentMenu
          onMoveToFolder={() => setShowMoveDialog(true)}
          onDelete={() => setShowDeleteDialog(true)}
        />
      </div>
      
      <div className="text-sm text-foreground/90 leading-relaxed font-condensed">
        {getDisplayContent()}
      </div>

      <MoveToFolderDialog
        isOpen={showMoveDialog}
        onClose={() => setShowMoveDialog(false)}
        onConfirm={handleMoveToFolder}
        currentFolder={folder}
        availableFolders={availableFolders}
        itemType={type}
      />

      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        itemType={type}
      />
    </div>
  );
};

export { ContentCard };