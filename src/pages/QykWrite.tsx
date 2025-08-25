import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import { BookOpen } from "lucide-react";
import { useEntries } from "@/hooks/useSupabaseData";
import { useUserFolders } from "@/hooks/useUserFolders";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";

const QykWrite = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { entries, loading, addEntry, deleteEntry, moveEntry } = useEntries();
  const { folders, addFolder } = useUserFolders('entry');
  const { getSelectedFolder, setSelectedFolder } = useUserSettings();
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [newItemIds, setNewItemIds] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const selectedFolder = getSelectedFolder('entry');

  const handleSubmit = async () => {
    if (currentTitle.trim() && currentContent.trim()) {
      const newEntry = await addEntry(currentContent.trim(), currentTitle.trim(), selectedFolder || undefined);
      if (newEntry) {
        setCurrentTitle("");
        setCurrentContent("");
        setNewItemIds(prev => [...prev, newEntry.id]);
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
    if (success) {
      // Optionally switch to the new folder
      await setSelectedFolder('entry', folderName);
    }
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
            <h2 className="text-xl font-bold text-foreground mb-2 font-space font-condensed">
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
        <div className="pt-safe">
          <ModernTitleWidget
            title="QykWrite"
            description={selectedFolder ? `Folder: ${selectedFolder}` : "Your long-form journal entries"}
            showFolderActions={true}
            onCreateFolder={handleCreateFolder}
            onViewFolders={handleViewFolders}
            canGoBack={true}
            backRoute="/"
          />
        </div>

        {/* Input Section */}
        <div className="glass-card p-6 rounded-3xl space-y-4 animate-slide-up hover-lift">
          <Input
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            placeholder="Entry title..."
            className="border-0 bg-muted/50 rounded-2xl h-12 px-4 text-base font-medium placeholder:text-muted-foreground/70 font-condensed"
          />
          
          <QykInput
            value={currentContent}
            onChange={setCurrentContent}
            placeholder="Start writing your thoughts..."
            rows={8}
            className="min-h-32"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground font-condensed">
              {currentContent.length} characters
            </span>
            <Button 
              onClick={handleSubmit}
              disabled={!currentTitle.trim() || !currentContent.trim()}
              className="rounded-full px-6 h-9 font-condensed hover:scale-105 transition-transform duration-200"
            >
              Save Entry
            </Button>
          </div>
        </div>

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