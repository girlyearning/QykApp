import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderWidget } from "@/components/FolderWidget";
import { FolderManager } from "@/components/FolderManager";
import { Button } from "@/components/ui/button";
import { Settings, Plus, Lock } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useConfessions } from "@/hooks/useSupabaseData";

const QykFessFolders = () => {
  const navigate = useNavigate();
  const { confessions } = useConfessions();
  const [folders, setFolders] = useLocalStorage<string[]>("qyk-fess-folders", []);
  const [selectedFolder, setSelectedFolder] = useLocalStorage<string>("qyk-fess-selected-folder", "");
  const [showFolderManager, setShowFolderManager] = useState(false);

  const getFolderCount = (folderName: string) => {
    return confessions.filter(confession => confession.folder === folderName).length;
  };

  const handleFolderSelect = (folderName: string) => {
    setSelectedFolder(folderName);
    navigate('/qyk-fess');
  };

  const handleViewAll = () => {
    setSelectedFolder("");
    navigate('/qyk-fess');
  };

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-safe animate-fade-in">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-primary font-space font-extra-condensed">Fess Folders</h1>
            <p className="text-sm text-muted-foreground font-medium font-condensed">
              Organize your private confessions
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-10 h-10 p-0"
            onClick={() => setShowFolderManager(!showFolderManager)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="glass-card p-4 rounded-3xl bg-primary/5 border border-primary/20 animate-slide-down">
          <div className="flex items-center gap-2 text-primary">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium font-condensed">
              Your confessions are private and secure
            </span>
          </div>
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

        {/* View All Confessions Button */}
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
                All Confessions
              </h3>
              <p className="text-sm text-muted-foreground font-condensed">
                {confessions.length} Total Confessions
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
                  type="confession"
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

export default QykFessFolders;