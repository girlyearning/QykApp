import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderOpen } from "lucide-react";

interface MoveToFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderName: string) => void;
  currentFolder?: string;
  availableFolders: string[];
  itemType: "note" | "entry" | "confession";
}

const MoveToFolderDialog = ({
  isOpen,
  onClose,
  onConfirm,
  currentFolder,
  availableFolders,
  itemType,
}: MoveToFolderDialogProps) => {
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  // Convert currentFolder for comparison (empty string becomes "main")
  const currentFolderValue = currentFolder || "main";

  const handleConfirm = () => {
    if (selectedFolder !== currentFolderValue) {
      // Convert "main" back to empty string for the API
      const folderToMove = selectedFolder === "main" ? "" : selectedFolder;
      onConfirm(folderToMove);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedFolder("");
    onClose();
  };

  const getItemTypeName = () => {
    switch (itemType) {
      case "note":
        return "note";
      case "entry":
        return "entry";
      case "confession":
        return "confession";
      default:
        return "item";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card bg-background/95 backdrop-blur-sm border-2 border-primary/30 rounded-3xl max-w-md mx-auto z-[9998]">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-primary font-space font-condensed">
            Move {getItemTypeName()}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground font-condensed">
            Choose a folder to move this {getItemTypeName()} to
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="folder-select" className="text-sm font-medium text-foreground font-condensed">
            Select Folder
          </Label>
          <div className="text-xs text-muted-foreground mb-2">
            Available folders: {availableFolders.length} 
            {availableFolders.length > 0 && ` - ${availableFolders.join(', ')}`}
          </div>
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="mt-2 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl">
              <SelectValue placeholder={availableFolders.length === 0 ? "No folders available" : "Choose a folder..."} />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border/50 rounded-xl z-[9999] shadow-lg" sideOffset={5}>
              <SelectItem value="main" className="rounded-lg">
                No folder (Main)
              </SelectItem>
              {availableFolders.length > 0 ? (
                availableFolders.map((folder) => (
                  <SelectItem 
                    key={folder} 
                    value={folder}
                    className="rounded-lg"
                    disabled={folder === currentFolder || (currentFolder === null && selectedFolder === "main")}
                  >
                    {folder}
                    {folder === currentFolder && " (current)"}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-folders-placeholder" disabled className="rounded-lg text-muted-foreground">
                  No folders available - create one first
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 rounded-xl border-border/50 hover:bg-background/80"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedFolder === currentFolderValue}
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { MoveToFolderDialog };