import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderWidget } from "@/components/FolderWidget";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEntries } from "@/hooks/useSupabaseData";
import { useUserFolders } from "@/hooks/useUserFolders";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";

const QykWriteFolders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { entries } = useEntries();
  const { folders, removeFolder } = useUserFolders('entry');
  const { getSelectedFolder, setSelectedFolder } = useUserSettings();
  const [showFolderManager, setShowFolderManager] = useState(false);

  const selectedFolder = getSelectedFolder('entry');

  const getFolderCount = (folderName: string) => {
    return entries.filter(entry => entry.folder === folderName).length;
  };

  const handleFolderSelect = async (folderName: string) => {
    await setSelectedFolder('entry', folderName);
    navigate('/qyk-write');
  };

  const handleViewAll = async () => {
    await setSelectedFolder('entry', '');
    navigate('/qyk-write');
  };

  const handleDeleteFolder = async (folderName: string) => {
    // Delete the folder
    const success = await removeFolder(folderName);
    
    // If we're currently viewing this folder, switch to all entries
    if (success && selectedFolder === folderName) {
      await setSelectedFolder('entry', '');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center py-12 animate-fade-in">
            <h2 className="text-xl font-bold text-foreground mb-2 font-space font-condensed">
              Sign in to access folders
            </h2>
            <Button onClick={() => navigate('/auth')} className="rounded-full px-6">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Modern Title Widget */}
        <div className="pt-safe">
          <ModernTitleWidget
            title="Write Folders"
            description="Organize your journal entries"
            showFolderActions={true}
            onCreateFolder={() => setShowFolderManager(!showFolderManager)}
            onViewFolders={() => setShowFolderManager(!showFolderManager)}
            canGoBack={true}
            backRoute="/qyk-write"
          />
        </div>

        {/* Folder Manager */}
        {showFolderManager && (
          <div className="animate-slide-down">
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-sm text-muted-foreground font-condensed mb-2">
                Use the folder menu (folder icon) in the main QykWrite page to create new folders
              </p>
            </div>
          </div>
        )}

        {/* View All Entries Button */}
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
                All Entries
              </h3>
              <p className="text-sm text-muted-foreground font-condensed">
                {entries.length} Total Entries
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
                  type="entry"
                  onSelect={() => handleFolderSelect(folder)}
                  onDelete={() => handleDeleteFolder(folder)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QykWriteFolders;