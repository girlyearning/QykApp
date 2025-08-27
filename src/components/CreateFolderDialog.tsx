import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import keyboard helpers only at the app level to avoid double listeners
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
  const dialogRef = useRef<HTMLDivElement>(null);
  // Avoid attaching extra keyboard listeners at the dialog level

  // Focus input after opening
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      const input = document.getElementById('folder-name') as HTMLInputElement | null;
      input?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFolderName("");
    }
  }, [isOpen]);

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
    if (e.key === "Enter" && folderName.trim()) {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        ref={dialogRef}
        className="glass-card bg-background/95 backdrop-blur-sm border-2 border-primary/30 rounded-3xl max-w-md mx-auto ios-keyboard-fix folder-dialog"
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-primary font-display font-condensed">
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
            autoComplete="off"
            inputMode="text"
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