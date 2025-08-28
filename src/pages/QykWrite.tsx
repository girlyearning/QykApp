import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { hapticImpact } from "@/lib/haptics";
import { Input } from "@/components/ui/input";
import { QykInput } from "@/components/QykInput";
import { ComposePopup } from "@/components/ComposePopup";
import { ContentCard } from "@/components/ContentCard";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import { BookOpen, Plus } from "lucide-react";
import { useEntries } from "@/hooks/useSupabaseData";
import { useFavorites } from "@/hooks/useFavorites";
import { useQykStats } from "@/hooks/useQykStats";
import { useUserFolders } from "@/hooks/useUserFolders";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";

const QykWrite = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { entries, loading, addEntry, deleteEntry, moveEntry, updateEntry } = useEntries();
  const { incrementToday } = useQykStats();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const { folders, addFolder } = useUserFolders('entry');
  const { getSelectedFolder, setSelectedFolder } = useUserSettings();
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [newItemIds, setNewItemIds] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  const selectedFolder = getSelectedFolder('entry');

  const handleSubmit = async () => {
    if (currentTitle.trim() && currentContent.trim()) {
      const newEntry = await addEntry(currentContent, currentTitle, selectedFolder || undefined);
      if (newEntry) {
        setCurrentTitle("");
        setCurrentContent("");
        setNewItemIds(prev => [...prev, newEntry.id]);
        incrementToday('entries');
        setShowCompose(false);
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
  };

  const handleMove = (id: string) => (newFolder: string) => {
    moveEntry(id, newFolder);
  };

  const filteredEntries = entries.filter(entry => 
    !selectedFolder || entry.folder === selectedFolder
  );

  const handleCreateFolder = () => {
    setShowCreateDialog(true);
  };

  const handleConfirmCreate = async (folderName: string) => {
    const success = await addFolder(folderName);
    // Don't auto-switch to new folder - let user stay in current view
  };

  const handleViewFolders = () => {
    navigate('/qyk-write-folders');
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2 font-display font-condensed">
              Sign in to access QykWrite
            </h2>
            <p className="text-muted-foreground font-condensed mb-6">
              Your journal entries are synced across all your devices
            </p>
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
        <div className="pt-safe pl-safe pr-safe">
          <ModernTitleWidget
            title="QykWrite"
            description={selectedFolder ? `Folder: ${selectedFolder}` : "Your long-form journal entries"}
            showFolderActions={true}
            onCreateFolder={handleCreateFolder}
            onViewFolders={handleViewFolders}
            canGoBack={true}
            backRoute="/"
            onOpenFavorites={() => navigate('/favorites')}
          />
        </div>

        {/* Folder Navigation Bar */}
        {selectedFolder && (
          <div className="glass-card p-4 rounded-2xl animate-slide-down">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-condensed">Currently viewing:</span>
                <span className="text-sm font-medium text-foreground font-condensed bg-primary/10 px-2 py-1 rounded-lg">
                  {selectedFolder}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFolder('entry', '')}
                className="rounded-full text-xs font-condensed hover:bg-primary/10"
              >
                View All Entries
              </Button>
            </div>
          </div>
        )}

        {/* Floating + Button to open composer */}
        <button
          aria-label="Add Entry"
          onClick={() => setShowCompose(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 flex items-center justify-center shadow-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-6 h-6" />
        </button>

        <ComposePopup
          isOpen={showCompose}
          onClose={() => setShowCompose(false)}
          heading="QykWrite"
          value={currentContent}
          onChange={setCurrentContent}
          placeholder="Start writing your thoughts..."
          buttonLabel="Save Entry"
          showTitleInput
          titleValue={currentTitle}
          onTitleChange={setCurrentTitle}
          titlePlaceholder="Entry title..."
          onSubmit={handleSubmit}
        />

        {/* Entries List */}
        <div className="space-y-3 stagger-animation">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-condensed">No entries yet. Start your writing journey!</p>
            </div>
          ) : (
            filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                style={{ '--stagger-delay': index } as React.CSSProperties}
                className="animate-slide-up"
              >
                 <ContentCard
                   title={entry.title || "Untitled"}
                   content={entry.content}
                   timestamp={new Date(entry.created_at)}
                   onDelete={() => handleDelete(entry.id)}
                   onMove={handleMove(entry.id)}
                   type="entry"
                   isNew={newItemIds.includes(entry.id)}
                   folder={entry.folder}
                   availableFolders={folders}
                   onUpdate={async (newContent) => {
                     await updateEntry(entry.id, newContent);
                   }}
                   onAddFavorite={!isFavorited('entry', entry.id) ? () => addFavorite('entry', entry.id) : undefined}
                   onRemoveFavorite={isFavorited('entry', entry.id) ? () => removeFavorite('entry', entry.id) : undefined}
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
        title="Create New Write Folder"
        description="Enter a name for your new journal folder"
      />
    </div>
  );
};

export default QykWrite;