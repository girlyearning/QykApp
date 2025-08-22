import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { Search, Folder } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useNotes } from "@/hooks/useSupabaseData";

const QykNote = () => {
  const navigate = useNavigate();
  const { notes, loading, addNote, deleteNote } = useNotes();
  const [currentNote, setCurrentNote] = useState("");
  const [newItemIds, setNewItemIds] = useState<string[]>([]);
  const [folders, setFolders] = useLocalStorage<string[]>("qyk-note-folders", []);
  const [selectedFolder, setSelectedFolder] = useLocalStorage<string>("qyk-note-selected-folder", "");

  const handleSubmit = async () => {
    if (currentNote.trim() && currentNote.length <= 200) {
      const newNote = await addNote(currentNote.trim(), selectedFolder);
      if (newNote) {
        setCurrentNote("");
        setNewItemIds(prev => [...prev, newNote.id]);
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
  };

  const filteredNotes = notes.filter(note => 
    !selectedFolder || note.folder === selectedFolder
  );

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-safe animate-fade-in">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-primary font-space font-extra-condensed">QykNote</h1>
            <p className="text-sm text-muted-foreground font-medium font-overused font-condensed">
              {selectedFolder ? `Folder: ${selectedFolder}` : "Quick 200-character thoughts and updates"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-10 h-10 p-0"
            onClick={() => navigate('/qyk-note-folders')}
          >
            <Folder className="w-4 h-4" />
          </Button>
        </div>

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
            <span className="text-xs text-muted-foreground font-overused font-condensed">
              {currentNote.length}/200 characters
            </span>
            <Button 
              onClick={handleSubmit}
              disabled={!currentNote.trim() || currentNote.length > 200}
              className="rounded-full px-6 h-9 font-overused font-condensed hover:scale-105 transition-transform duration-200"
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
              <p className="text-muted-foreground font-overused font-condensed">No notes yet. Share your first thought!</p>
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
                   type="note"
                   isNew={newItemIds.includes(note.id)}
                 />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QykNote;