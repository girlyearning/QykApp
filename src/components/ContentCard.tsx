import { memo, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button";
import { Clock, Heart } from "lucide-react";
import { ContentMenu } from "@/components/ContentMenu";
import { FolderTag } from "@/components/FolderTag";
import { MoveToFolderDialog } from "@/components/MoveToFolderDialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

import type { PicAttachmentMeta } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";

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
  attachments?: PicAttachmentMeta[];
  onUpdate?: (newContent: string) => Promise<void> | void;
  onAddFavorite?: () => void;
  onRemoveFavorite?: () => void;
}

const ContentCardComponent = ({ 
  title, 
  content, 
  timestamp, 
  onDelete, 
  onMove,
  type, 
  isNew = false,
  folder,
  availableFolders = [],
  attachments = [],
  onUpdate,
  onAddFavorite,
  onRemoveFavorite
}: ContentCardProps) => {
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editText, setEditText] = useState(content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditText(content);
  }, [content]);

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
        // Show full entry content; do not truncate to avoid perceived cut-off
        return content;
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

  const favorited = Boolean(onRemoveFavorite);

  return (
    <div className={`glass-card p-4 rounded-2xl group transition-all duration-300 hover-lift animate-scale-in card-outline-glow ${
      isNew ? 'ring-1 ring-primary/70 animate-pulse-glow bg-primary/5' : ''
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center justify-start gap-2 mb-2">
            <h4 className="font-medium text-foreground text-sm font-display font-condensed">{title}</h4>
            {folder && <FolderTag folderName={folder} />}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="font-condensed">{formatTimestamp(timestamp)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(onAddFavorite || onRemoveFavorite) && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-70 hover:opacity-100 hover:bg-muted/50 transition-all duration-200 h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
              onClick={() => {
                if (favorited && onRemoveFavorite) onRemoveFavorite();
                else if (!favorited && onAddFavorite) onAddFavorite();
              }}
              title={favorited ? 'Remove Favorite' : 'Add to Favorites'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'text-pink-500 fill-current' : ''}`} />
            </Button>
          )}
          <ContentMenu
            onMoveToFolder={() => setShowMoveDialog(true)}
            onDelete={() => setShowDeleteDialog(true)}
            onEdit={() => setIsEditOpen(true)}
            onAddFavorite={onAddFavorite}
            onRemoveFavorite={onRemoveFavorite}
          />
        </div>
      </div>
      
      <div className="prose prose-post max-w-none leading-relaxed font-condensed prose-headings:font-display prose-li:my-0 prose-p:my-1 prose-ul:ml-5 prose-ol:ml-5 whitespace-pre-wrap dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]}>
          {getDisplayContent()}
        </ReactMarkdown>
      </div>

      {(type === 'note' || type === 'confession') && attachments && attachments.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {attachments.map((a, idx) => {
            const { data } = supabase.storage.from(a.bucket || 'attachments').getPublicUrl(a.path);
            const url = data.publicUrl;
            return (
              <img key={idx} src={url} className="w-full h-24 object-cover rounded-xl" />
            );
          })}
        </div>
      )}

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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="glass-card rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit {title}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={8}
              className="w-full resize-y rounded-2xl"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button
              disabled={saving || editText.trim().length === 0}
              onClick={async () => {
                try {
                  setSaving(true);
                  (document.activeElement as HTMLElement)?.blur();
                  if (onUpdate) {
                    await onUpdate(editText);
                  }
                  setIsEditOpen(false);
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Memoize to avoid unnecessary re-renders of large lists
const ContentCard = memo(ContentCardComponent);

export { ContentCard };