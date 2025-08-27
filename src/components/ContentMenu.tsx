import { MoreVertical, FolderOpen, Trash2, Pencil, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentMenuProps {
  onMoveToFolder?: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  onRemoveFavorite?: () => void;
}

const ContentMenu = ({ onMoveToFolder, onDelete, onEdit, onRemoveFavorite }: ContentMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-60 group-hover:opacity-100 hover:bg-muted/50 transition-all duration-200 h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:scale-110 border border-transparent hover:border-border/30 rounded-lg"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="z-50 bg-background border border-border/50 rounded-xl shadow-lg backdrop-blur-sm min-w-[160px]"
      >
        {onEdit && (
        <DropdownMenuItem 
          onClick={onEdit} 
          className="cursor-pointer rounded-lg hover:bg-primary/10 focus:bg-primary/10 px-3 py-2"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        )}
        {onRemoveFavorite && (
          <DropdownMenuItem
            onClick={onRemoveFavorite}
            className="cursor-pointer rounded-lg hover:bg-primary/10 focus:bg-primary/10 px-3 py-2"
          >
            <HeartOff className="w-4 h-4 mr-2" />
            Remove Favorite
          </DropdownMenuItem>
        )}
        {onMoveToFolder && (
          <DropdownMenuItem 
            onClick={onMoveToFolder} 
            className="cursor-pointer rounded-lg hover:bg-primary/10 focus:bg-primary/10 px-3 py-2"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Move to Folder
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={onDelete} 
          className="cursor-pointer rounded-lg hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive px-3 py-2"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ContentMenu };