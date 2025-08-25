import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderName: string) => void;
  title?: string;
  description?: string;
}

const CreateFolderDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Create New Folder",
  description = "Enter a name for your new folder",
}: CreateFolderDialogProps) => {
  const [folderName, setFolderName] = useState("");

  const handleConfirm = () => {
    if (folderName.trim()) {
      onConfirm(folderName.trim());
      setFolderName("");
      onClose();
    }
  };

  const handleCancel = () => {
    setFolderName("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card bg-background/95 backdrop-blur-sm border-2 border-primary/30 rounded-3xl max-w-md mx-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-primary font-space font-condensed">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground font-condensed">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="folder-name" className="text-sm font-medium text-foreground font-condensed">
            Folder Name
          </Label>
          <Input
            id="folder-name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter folder name..."
            className="mt-2 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
            autoFocus
          />
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
            disabled={!folderName.trim()}
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CreateFolderDialog };