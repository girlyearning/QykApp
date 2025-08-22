import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, Plus, Edit2, Trash2, X } from "lucide-react";

interface FolderManagerProps {
  folders: string[];
  selectedFolder: string;
  onFolderSelect: (folder: string) => void;
  onFoldersChange: (folders: string[]) => void;
}

const FolderManager = ({ folders, selectedFolder, onFolderSelect, onFoldersChange }: FolderManagerProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [editFolderName, setEditFolderName] = useState("");

  const createFolder = () => {
    const name = newFolderName.trim();
    if (name && !folders.includes(name)) {
      onFoldersChange([...folders, name]);
      setNewFolderName("");
      setIsCreating(false);
    }
  };

  const renameFolder = (oldName: string) => {
    const name = editFolderName.trim();
    if (name && !folders.includes(name) && name !== oldName) {
      const newFolders = folders.map(f => f === oldName ? name : f);
      onFoldersChange(newFolders);
      if (selectedFolder === oldName) {
        onFolderSelect(name);
      }
    }
    setIsEditing(null);
    setEditFolderName("");
  };

  const deleteFolder = (folderName: string) => {
    const newFolders = folders.filter(f => f !== folderName);
    onFoldersChange(newFolders);
    if (selectedFolder === folderName && newFolders.length > 0) {
      onFolderSelect(newFolders[0]);
    }
  };

  const startEdit = (folderName: string) => {
    setEditFolderName(folderName);
    setIsEditing(folderName);
  };

  return (
    <div className="glass-card p-4 rounded-3xl animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Folder className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground font-space font-condensed">Folders</span>
      </div>
      
      <div className="flex flex-wrap gap-2 stagger-animation">
        {folders.map((folder, index) => (
          <div
            key={folder}
            style={{ '--stagger-delay': index } as React.CSSProperties}
            className="animate-fade-in"
          >
            {isEditing === folder ? (
              <div className="flex items-center gap-1">
                <Input
                  value={editFolderName}
                  onChange={(e) => setEditFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') renameFolder(folder);
                    if (e.key === 'Escape') setIsEditing(null);
                  }}
                  className="h-8 w-24 text-xs rounded-full border-primary/50"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => renameFolder(folder)}
                >
                  ✓
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  variant={selectedFolder === folder ? "default" : "outline"}
                  size="sm"
                  className="rounded-full h-8 px-4 text-xs font-overused font-condensed hover-lift"
                  onClick={() => onFolderSelect(folder)}
                >
                  {folder}
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-space">Manage Folder</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => startEdit(folder)}
                        className="w-full justify-start"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Rename
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteFolder(folder)}
                        className="w-full justify-start"
                        disabled={folders.length === 1}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        ))}

        {isCreating ? (
          <div className="flex items-center gap-1 animate-scale-in">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') createFolder();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              placeholder="Folder name..."
              className="h-8 w-28 text-xs rounded-full border-primary/50"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={createFolder}
            >
              ✓
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsCreating(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-8 w-8 p-0 hover-lift animate-bounce-in"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export { FolderManager };