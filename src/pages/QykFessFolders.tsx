import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderWidget } from "@/components/FolderWidget";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import { Button } from "@/components/ui/button";
import { Plus, Lock } from "lucide-react";
import { useConfessions } from "@/hooks/useSupabaseData";
import { useUserFolders } from "@/hooks/useUserFolders";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";

const QykFessFolders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { confessions } = useConfessions();
  const { folders, removeFolder, addFolder, renameFolder } = useUserFolders('confession');
  const { getSelectedFolder, setSelectedFolder } = useUserSettings();
  const [showFolderManager, setShowFolderManager] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const selectedFolder = getSelectedFolder('confession');

  const getFolderCount = (folderName: string) => {
    return confessions.filter(confession => confession.folder === folderName).length;
  };

  const handleFolderSelect = async (folderName: string) => {
    await setSelectedFolder('confession', folderName);
    navigate('/qyk-fess');
  };

  const handleViewAll = async () => {
    await setSelectedFolder('confession', '');
    navigate('/qyk-fess');
  };

  const handleCreateFolder = () => {
    setShowCreateDialog(true);
  };

  const handleConfirmCreate = async (folderName: string) => {
    await addFolder(folderName);
  };

  const handleDeleteFolder = async (folderName: string) => {
    // Delete the folder
    const success = await removeFolder(folderName);
    
    // If we're currently viewing this folder, switch to all confessions
    if (success && selectedFolder === folderName) {
      await setSelectedFolder('confession', '');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center py-12 animate-fade-in">
            <h2 className="text-xl font-bold text-foreground mb-2 font-display font-condensed">
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
            title="Fess Folders"
            description="Organize your private confessions"
            showFolderActions={true}
            onCreateFolder={handleCreateFolder}
            onViewFolders={() => setShowFolderManager(!showFolderManager)}
            canGoBack={true}
            backRoute="/qyk-fess"
          />
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
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-sm text-muted-foreground font-condensed mb-2">
                Use the folder menu (folder icon) in the main QykFess page to create new folders
              </p>
            </div>
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
              <h3 className="font-semibold text-foreground font-display font-condensed text-base">
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
                  onDelete={() => handleDeleteFolder(folder)}
                  onRename={async (newName) => { await renameFolder(folder, newName); }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <CreateFolderDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onConfirm={handleConfirmCreate}
        title="Create New Fess Folder"
        description="Enter a name for your new confession folder"
      />
    </div>
  );
};

export default QykFessFolders;