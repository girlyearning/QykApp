import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import { Lock } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useConfessions } from "@/hooks/useSupabaseData";

const QykFess = () => {
  const navigate = useNavigate();
  const { confessions, loading, addConfession, deleteConfession, moveConfession } = useConfessions();
  const [currentConfession, setCurrentConfession] = useState("");
  const [newItemIds, setNewItemIds] = useState<string[]>([]);
  const [folders, setFolders] = useLocalStorage<string[]>("qyk-fess-folders", []);
  const [selectedFolder, setSelectedFolder] = useLocalStorage<string>("qyk-fess-selected-folder", "");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleSubmit = async () => {
    if (currentConfession.trim() && currentConfession.length <= 350) {
      const newConfession = await addConfession(currentConfession.trim(), selectedFolder);
      if (newConfession) {
        setCurrentConfession("");
        setNewItemIds(prev => [...prev, newConfession.id]);
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteConfession(id);
  };

  const handleMove = (id: string) => (newFolder: string) => {
    moveConfession(id, newFolder);
  };

  const filteredConfessions = confessions.filter(confession => 
    !selectedFolder || confession.folder === selectedFolder
  );

  const handleCreateFolder = () => {
    setShowCreateDialog(true);
  };

  const handleConfirmCreate = (folderName: string) => {
    if (!folders.includes(folderName)) {
      setFolders([...folders, folderName]);
    }
  };

  const handleViewFolders = () => {
    navigate('/qyk-fess-folders');
  };

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Modern Title Widget */}
        <div className="pt-safe">
          <ModernTitleWidget
            title="QykFess"
            description={selectedFolder ? `Folder: ${selectedFolder}` : "Your private confessions"}
            count={confessions.length}
            showFolderActions={true}
            onCreateFolder={handleCreateFolder}
            onViewFolders={handleViewFolders}
            canGoBack={true}
            backRoute="/"
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

        {/* Input Section */}
        <div className="glass-card p-6 rounded-3xl animate-slide-up hover-lift">
          <QykInput
            value={currentConfession}
            onChange={setCurrentConfession}
            placeholder="Share your confession safely..."
            maxLength={350}
            rows={4}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-muted-foreground font-condensed">
              {currentConfession.length}/350 characters
            </span>
            <Button 
              onClick={handleSubmit}
              disabled={!currentConfession.trim() || currentConfession.length > 350}
              className="rounded-full px-6 h-9 font-condensed hover:scale-105 transition-transform duration-200"
            >
              Confess
            </Button>
          </div>
        </div>

        {/* Confessions List */}
        <div className="space-y-3 stagger-animation">
          {filteredConfessions.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-condensed">No confessions yet. Share what's on your mind.</p>
            </div>
          ) : (
            filteredConfessions.map((confession, index) => (
              <div
                key={confession.id}
                style={{ '--stagger-delay': index } as React.CSSProperties}
                className="animate-slide-up"
              >
                   <ContentCard
                    title="QykFess"
                    content={confession.content}
                    timestamp={new Date(confession.created_at)}
                    onDelete={() => handleDelete(confession.id)}
                    onMove={handleMove(confession.id)}
                    type="confession"
                    isNew={newItemIds.includes(confession.id)}
                    folder={confession.folder}
                    availableFolders={folders}
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

export default QykFess;