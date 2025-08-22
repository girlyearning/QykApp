import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { Folder, Plus, Search, BookOpen } from "lucide-react";

interface Entry {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  folder?: string;
}

const QykWrite = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [folders, setFolders] = useState<string[]>(["Personal", "Work", "Ideas"]);
  const [selectedFolder, setSelectedFolder] = useState("Personal");

  const handleSubmit = () => {
    if (currentTitle.trim() && currentContent.trim()) {
      const newEntry: Entry = {
        id: Date.now().toString(),
        title: currentTitle.trim(),
        content: currentContent.trim(),
        timestamp: new Date(),
        folder: selectedFolder,
      };
      setEntries([newEntry, ...entries]);
      setCurrentTitle("");
      setCurrentContent("");
    }
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const filteredEntries = entries.filter(entry => 
    !selectedFolder || entry.folder === selectedFolder
  );

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-safe">
          <h1 className="text-3xl font-bold text-primary">QykWrite</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Long-form journal entries and thoughts
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
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <Input
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            placeholder="Entry title..."
            className="border-0 bg-muted/50 rounded-2xl h-12 px-4 text-base font-medium placeholder:text-muted-foreground/70"
          />
          
          <QykInput
            value={currentContent}
            onChange={setCurrentContent}
            placeholder="Start writing your thoughts..."
            rows={8}
            className="min-h-32"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {currentContent.length} characters
            </span>
            <Button 
              onClick={handleSubmit}
              disabled={!currentTitle.trim() || !currentContent.trim()}
              className="rounded-full px-6 h-9"
            >
              Save Entry
            </Button>
          </div>
        </div>

        {/* Entries List */}
        <div className="space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No entries yet. Start your writing journey!</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <ContentCard
                key={entry.id}
                title={entry.title}
                content={entry.content}
                timestamp={entry.timestamp}
                onDelete={() => deleteEntry(entry.id)}
                type="entry"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QykWrite;