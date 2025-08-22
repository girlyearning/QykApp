import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { BookOpen, Folder } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEntries } from "@/hooks/useSupabaseData";

const QykWrite = () => {
  const navigate = useNavigate();
  const { entries, loading, addEntry, deleteEntry } = useEntries();
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [newItemIds, setNewItemIds] = useState<string[]>([]);
  const [folders, setFolders] = useLocalStorage<string[]>("qyk-write-folders", []);
  const [selectedFolder, setSelectedFolder] = useLocalStorage<string>("qyk-write-selected-folder", "");

  const handleSubmit = async () => {
    if (currentTitle.trim() && currentContent.trim()) {
      const newEntry = await addEntry(currentContent.trim(), currentTitle.trim(), selectedFolder);
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

  const filteredEntries = entries.filter(entry => 
    !selectedFolder || entry.folder === selectedFolder
  );

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-safe animate-fade-in">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-primary font-space font-extra-condensed">QykWrite</h1>
            <p className="text-sm text-muted-foreground font-medium font-overused font-condensed">
              {selectedFolder ? `Folder: ${selectedFolder}` : "Long-form journal entries and thoughts"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-10 h-10 p-0"
            onClick={() => navigate('/qyk-write-folders')}
          >
            <Folder className="w-4 h-4" />
          </Button>
        </div>

        {/* Input Section */}
        <div className="glass-card p-6 rounded-3xl space-y-4 animate-slide-up hover-lift">
          <Input
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            placeholder="Entry title..."
            className="border-0 bg-muted/50 rounded-2xl h-12 px-4 text-base font-medium placeholder:text-muted-foreground/70 font-overused font-condensed"
          />
          
          <QykInput
            value={currentContent}
            onChange={setCurrentContent}
            placeholder="Start writing your thoughts..."
            rows={8}
            className="min-h-32"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground font-overused font-condensed">
              {currentContent.length} characters
            </span>
            <Button 
              onClick={handleSubmit}
              disabled={!currentTitle.trim() || !currentContent.trim()}
              className="rounded-full px-6 h-9 font-overused font-condensed hover:scale-105 transition-transform duration-200"
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
              <p className="text-muted-foreground font-overused font-condensed">No entries yet. Start your writing journey!</p>
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
                   type="entry"
                   isNew={newItemIds.includes(entry.id)}
                 />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QykWrite;