import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";

interface FolderTagProps {
  folderName: string;
}

const FolderTag = ({ folderName }: FolderTagProps) => {
  if (!folderName) return null;

  return (
    <Badge 
      variant="secondary" 
      className="rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20 flex items-center gap-1"
    >
      <Folder className="w-3 h-3" />
      {folderName}
    </Badge>
  );
};

export { FolderTag };