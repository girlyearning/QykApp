import { Folder, FileText, MoreVertical, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

interface FolderWidgetProps {
  name: string;
  count: number;
  type: 'note' | 'entry' | 'confession';
  onSelect: () => void;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
}

const FolderWidget = ({ name, count, type, onSelect, onDelete, onRename }: FolderWidgetProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleRename = async () => {
    const newName = prompt('Rename folder', name)?.trim();
    if (!newName || newName === name) return;
    onRename?.(newName);
  };
  const getIcon = () => {
    switch (type) {
      case 'note':
        return <FileText className="w-5 h-5" />;
      case 'entry':
        return <FileText className="w-5 h-5" />;
      case 'confession':
        return <FileText className="w-5 h-5" />;
      default:
        return <Folder className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'note':
        return 'Notes';
      case 'entry':
        return 'Entries';
      case 'confession':
        return 'Confessions';
      default:
        return 'Items';
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteDialog(false);
  };

  return (
    <div className="glass-card p-6 rounded-3xl hover:shadow-md transition-all duration-300 hover-lift animate-fade-in border-2 border-primary/60 group">
      <div className="flex items-center gap-3 w-full">
        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          {getIcon()}
        </div>
        <div className="flex-1 text-left cursor-pointer" onClick={onSelect}>
          <h3 className="font-semibold text-foreground font-display font-condensed text-base">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground font-condensed">
            {count} {getTypeLabel()}
          </p>
        </div>
        {onDelete && (
          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="z-50 bg-background border border-border/50 rounded-xl shadow-lg backdrop-blur-sm min-w-[160px]"
              >
                {onRename && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename();
                    }}
                    className="cursor-pointer rounded-lg px-3 py-2"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Rename Folder
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                  className="cursor-pointer rounded-lg hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive px-3 py-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {onDelete && (
        <ConfirmDeleteDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          itemType={type}
          title={`Delete ${name} folder?`}
          description={`Are you sure you want to delete the "${name}" folder? All ${getTypeLabel().toLowerCase()} in this folder will be moved to the main folder. This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export { FolderWidget };