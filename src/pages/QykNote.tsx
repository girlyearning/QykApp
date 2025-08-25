import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import { Search } from "lucide-react";
import { useNotes } from "@/hooks/useSupabaseData";
import { useUserFolders } from "@/hooks/useUserFolders";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";

const QykNote = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notes, loading, addNote, deleteNote, moveNote } = useNotes();
  const { folders, addFolder } = useUserFolders('note');
  const { getSelectedFolder, setSelectedFolder } = useUserSettings();
  const [currentNote, setCurrentNote] = useState("");
  const [newItemIds, setNewItemIds] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const selectedFolder = getSelectedFolder('note');

  const handleSubmit = async () => {
    if (currentNote.trim() && currentNote.length <= 200) {
      const newNote = await addNote(currentNote.trim(), selectedFolder || undefined);
      if (newNote) {
        setCurrentNote("");
        setNewItemIds(prev => [...prev, newNote.id]);
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
  };

  const handleMove = (id: string) => (newFolder: string) => {
    moveNote(id, newFolder);
  };

  const filteredNotes = notes.filter(note => 
    !selectedFolder || note.folder === selectedFolder
  );

  const handleCreateFolder = () => {
    setShowCreateDialog(true);
  };

  const handleConfirmCreate = async (folderName: string) => {
    const success = await addFolder(folderName);
    // Don't auto-switch to new folder - let user stay in current view
  };

  const handleViewFolders = () => {
    navigate('/qyk-note-folders');
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2 font-space font-condensed">
              Sign in to access QykNote
            </h2>
            <p className="text-muted-foreground font-condensed mb-6">
              Your notes are synced across all your devices
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
            title="QykNote"
            description={selectedFolder ? `Folder: ${selectedFolder}` : "Your low-effort thoughts & updates"}
            showFolderActions={true}
            onCreateFolder={handleCreateFolder}
            onViewFolders={handleViewFolders}
            canGoBack={true}
            backRoute="/"
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
                onClick={() => setSelectedFolder('note', '')}
                className="rounded-full text-xs font-condensed hover:bg-primary/10"
              >
                View All Notes
              </Button>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="glass-card p-6 rounded-3xl animate-slide-up hover-lift">
          <QykInput
            value={currentNote}
            onChange={setCurrentNote}
            placeholder="What's on your mind?"
            maxLength={200}
            rows={3}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-muted-foreground font-condensed">
              {currentNote.length}/200 characters
            </span>
            <Button 
              onClick={handleSubmit}
              disabled={!currentNote.trim() || currentNote.length > 200}
              className="rounded-full px-6 h-9 font-condensed hover:scale-105 transition-transform duration-200"
            >
              Post Note
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3 stagger-animation">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-condensed">No notes yet. Share your first thought!</p>
            </div>
          ) : (
            filteredNotes.map((note, index) => (
              <div
                key={note.id}
                style={{ '--stagger-delay': index } as React.CSSProperties}
                className="animate-slide-up"
              >
                 <ContentCard
                   title="QykNote"
                   content={note.content}
                   timestamp={new Date(note.created_at)}
                   onDelete={() => handleDelete(note.id)}
                   onMove={handleMove(note.id)}
                   type="note"
                   isNew={newItemIds.includes(note.id)}
                   folder={note.folder}
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
        title="Create New Note Folder"
        description="Enter a name for your new note folder"
      />
    </div>
  );
};

export default QykNote;