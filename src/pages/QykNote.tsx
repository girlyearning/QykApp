import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { Folder, Plus, Search } from "lucide-react";

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  folder?: string;
}

const QykNote = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [folders, setFolders] = useState<string[]>(["General"]);
  const [selectedFolder, setSelectedFolder] = useState("General");

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
        <div className="text-center space-y-2 pt-safe">
          <h1 className="text-3xl font-bold text-primary">QykNote</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Quick 200-character thoughts and updates
          </p>
        </div>

        {/* Folder Selection */}
        <div className="glass-card p-4 rounded-3xl">
          <div className="flex items-center gap-2 mb-3">
            <Folder className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Folders</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {folders.map((folder) => (
              <Button
                key={folder}
                variant={selectedFolder === folder ? "default" : "outline"}
                size="sm"
                className="rounded-full h-8 px-4 text-xs"
                onClick={() => setSelectedFolder(folder)}
              >
                {folder}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Input Section */}
        <div className="glass-card p-6 rounded-3xl">
          <QykInput
            value={currentNote}
            onChange={setCurrentNote}
            placeholder="What's on your mind?"
            maxLength={200}
            rows={3}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-muted-foreground">
              {currentNote.length}/200 characters
            </span>
            <Button 
              onClick={handleSubmit}
              disabled={!currentNote.trim() || currentNote.length > 200}
              className="rounded-full px-6 h-9"
            >
              Post Note
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No notes yet. Share your first thought!</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <ContentCard
                key={note.id}
                title="QykNote"
                content={note.content}
                timestamp={note.timestamp}
                onDelete={() => deleteNote(note.id)}
                type="note"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QykNote;