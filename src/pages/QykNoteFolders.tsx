import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderWidget } from "@/components/FolderWidget";
import { FolderManager } from "@/components/FolderManager";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useNotes } from "@/hooks/useSupabaseData";

const QykNoteFolders = () => {
  const navigate = useNavigate();
  const { notes } = useNotes();
  const [folders, setFolders] = useLocalStorage<string[]>("qyk-note-folders", []);
  const [selectedFolder, setSelectedFolder] = useLocalStorage<string>("qyk-note-selected-folder", "");
  const [showFolderManager, setShowFolderManager] = useState(false);

  const getFolderCount = (folderName: string) => {
    return notes.filter(note => note.folder === folderName).length;
  };

  const handleFolderSelect = (folderName: string) => {
    setSelectedFolder(folderName);
    navigate('/qyk-note');
  };

  const handleViewAll = () => {
    setSelectedFolder("");
    navigate('/qyk-note');
  };

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Modern Title Widget */}
        <div className="pt-safe">
          <ModernTitleWidget
            title="Note Folders"
            description="Organize your quick thoughts"
            showFolderActions={true}
            onCreateFolder={() => setShowFolderManager(!showFolderManager)}
            onViewFolders={() => setShowFolderManager(!showFolderManager)}
            canGoBack={true}
            backRoute="/qyk-note"
          />
        </div>

        {/* Folder Manager */}
        {showFolderManager && (
          <div className="animate-slide-down">
            <FolderManager
              folders={folders}
              selectedFolder={selectedFolder}
              onFolderSelect={setSelectedFolder}
              onFoldersChange={setFolders}
            />
          </div>
        )}

        {/* View All Notes Button */}
        <Button
          variant="outline"
          className="glass-card p-4 h-auto flex items-center justify-between w-full hover-lift rounded-3xl animate-fade-in"
          onClick={handleViewAll}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground font-space font-condensed text-base">
                All Notes
              </h3>
              <p className="text-sm text-muted-foreground font-condensed">
                {notes.length} Total Notes
              </p>
            </div>
          </div>
        </Button>

        {/* Folder Widgets */}
        <div className="space-y-3 stagger-animation">
          {folders.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-condensed">No folders yet. Create your first one!</p>
            </div>
          ) : (
            folders.map((folder, index) => (
              <div
                key={folder}
                style={{ '--stagger-delay': index } as React.CSSProperties}
                className="animate-slide-up"
              >
                <FolderWidget
                  name={folder}
                  count={getFolderCount(folder)}
                  type="note"
                  onSelect={() => handleFolderSelect(folder)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QykNoteFolders;