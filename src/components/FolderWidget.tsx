import { Folder, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderWidgetProps {
  name: string;
  count: number;
  type: 'note' | 'entry' | 'confession';
  onSelect: () => void;
}

const FolderWidget = ({ name, count, type, onSelect }: FolderWidgetProps) => {
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

  return (
    <Button
      variant="outline"
      className="glass-card p-6 h-auto flex-col items-start space-y-3 w-full hover-lift rounded-3xl animate-fade-in"
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          {getIcon()}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-foreground font-space font-condensed text-base">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground font-condensed">
            {count} {getTypeLabel()}
          </p>
        </div>
      </div>
    </Button>
  );
};

export { FolderWidget };