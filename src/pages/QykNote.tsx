import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { hapticImpact } from "@/lib/haptics";
import { QykInput } from "@/components/QykInput";
import { ComposePopup } from "@/components/ComposePopup";
import { ContentCard } from "@/components/ContentCard";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import { Search, Paperclip, Plus } from "lucide-react";
import { Camera } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import { useNotes } from "@/hooks/useSupabaseData";
import { useFavorites } from "@/hooks/useFavorites";
import { useQykStats } from "@/hooks/useQykStats";
import { useUserFolders } from "@/hooks/useUserFolders";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";

const QykNote = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notes, loading, addNote, deleteNote, moveNote, updateNote } = useNotes();
  const { incrementToday } = useQykStats();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const { folders, addFolder } = useUserFolders('note');
  const { getSelectedFolder, setSelectedFolder } = useUserSettings();
  const [currentNote, setCurrentNote] = useState("");
  const [newItemIds, setNewItemIds] = useState<string[]>([]);
  const [selectedImagePaths, setSelectedImagePaths] = useState<string[]>([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const BUCKET = 'attachments';
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const selectedFolder = getSelectedFolder('note');

  const handleSubmit = async () => {
    if (currentNote.trim() && currentNote.length <= 200) {
      const attachments = selectedImagePaths.map((path) => ({ bucket: BUCKET, path } as any));
      const newNote = await addNote(currentNote, selectedFolder || undefined, attachments);
      if (newNote) {
        setCurrentNote("");
        setNewItemIds(prev => [...prev, newNote.id]);
        setSelectedImagePaths([]);
        setSelectedImagePreviews([]);
        incrementToday('notes');
        setShowCompose(false);
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
  };

  const handleMove = (id: string) => (newFolder: string) => {
    moveNote(id, newFolder);
  };

  const base64ToBlob = (base64: string, contentType = 'application/octet-stream') => {
    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];
    const sliceSize = 1024;
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const readPhotoAsBlob = async (p: { path?: string; webPath?: string; format?: string }) => {
    const ext = (p.format || 'jpg').toLowerCase();
    const mime = `image/${ext}`;
    if (Capacitor.getPlatform() !== 'web' && p.path) {
      const { data } = await Filesystem.readFile({ path: p.path });
      return base64ToBlob(data, mime);
    }
    if (p.webPath) return await fetch(p.webPath).then(r => r.blob());
    throw new Error('No accessible path');
  };

  const handleAttachImages = async () => {
    await Camera.requestPermissions({ permissions: ['photos'] as any });
    const selection = await Camera.pickImages({ quality: 80, limit: 3, presentationStyle: 'popover' });
    const newPaths: string[] = [];
    const newPreviews: string[] = [];
    for (const p of selection.photos || []) {
      const blob = await readPhotoAsBlob(p);
      const ext = (p.format || 'jpg').toLowerCase();
      const path = `${user!.id}/note/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: blob.type || `image/${ext}` });
      if (error) throw error;
      newPaths.push(path);
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      newPreviews.push(data.publicUrl);
    }
    setSelectedImagePaths(prev => [...prev, ...newPaths]);
    setSelectedImagePreviews(prev => [...prev, ...newPreviews]);
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
            <h2 className="text-xl font-bold text-foreground mb-2 font-display font-condensed">
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
        <div className="pt-safe pl-safe pr-safe">
          <ModernTitleWidget
            title="QykNote"
            description={selectedFolder ? `Folder: ${selectedFolder}` : "Your low-effort thoughts & updates"}
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
                onClick={() => setSelectedFolder('note', '')}
                className="rounded-full text-xs font-condensed hover:bg-primary/10"
              >
                View All Notes
              </Button>
            </div>
          </div>
        )}

        {/* Floating + Button to open composer */}
        <button
          aria-label="Add Note"
          onClick={() => setShowCompose(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 flex items-center justify-center shadow-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-6 h-6" />
        </button>
        <ComposePopup
          isOpen={showCompose}
          onClose={() => setShowCompose(false)}
          heading="QykNote"
          value={currentNote}
          onChange={setCurrentNote}
          placeholder="What's on your mind?"
          maxLength={200}
          buttonLabel="Post Note"
          onSubmit={handleSubmit}
          attachmentSlot={
            <Button
              variant="outline"
              onClick={handleAttachImages}
              className="rounded-full h-9 w-9 p-0"
              title="Attach Image"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          }
        />


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
                   attachments={(note as any).attachments || []}
                   onUpdate={async (newContent) => {
                     await updateNote(note.id, newContent);
                   }}
                   onAddFavorite={!isFavorited('note', note.id) ? () => addFavorite('note', note.id) : undefined}
                   onRemoveFavorite={isFavorited('note', note.id) ? () => removeFavorite('note', note.id) : undefined}
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