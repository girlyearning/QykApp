import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: "note" | "entry" | "confession";
  title?: string;
  description?: string;
}

const ConfirmDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  title,
  description,
}: ConfirmDeleteDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
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

  const defaultTitle = `Delete ${getItemTypeName()}?`;
  const defaultDescription = `Are you sure you want to delete this ${getItemTypeName()}? This action cannot be undone.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card bg-background/95 backdrop-blur-sm border-2 border-destructive/30 rounded-3xl max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground font-space font-condensed">
            {title || defaultTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground font-condensed">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl border-border/50 hover:bg-background/80"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ConfirmDeleteDialog };