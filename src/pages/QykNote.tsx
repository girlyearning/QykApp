import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { FolderManager } from "@/components/FolderManager";
import { Search } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  folder?: string;
}

const QykNote = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>("qyk-notes", []);
  const [currentNote, setCurrentNote] = useState("");
  const [folders, setFolders] = useLocalStorage<string[]>("qyk-note-folders", ["General"]);
  const [selectedFolder, setSelectedFolder] = useLocalStorage<string>("qyk-note-selected-folder", "General");

  const handleSubmit = () => {
    if (currentNote.trim() && currentNote.length <= 200) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: currentNote.trim(),
        timestamp: new Date(),
        folder: selectedFolder,
      };
      setNotes([newNote, ...notes]);
      setCurrentNote("");
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = notes.filter(note => 
    !selectedFolder || note.folder === selectedFolder
  );

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-safe animate-fade-in">
          <h1 className="text-3xl font-bold text-primary font-space font-extra-condensed">QykNote</h1>
          <p className="text-sm text-muted-foreground font-medium font-overused font-condensed">
            Quick 200-character thoughts and updates
          </p>
        </div>

        {/* Folder Management */}
        <FolderManager
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          onFoldersChange={setFolders}
        />

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
                  timestamp={note.timestamp}
                  onDelete={() => deleteNote(note.id)}
                  type="note"
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