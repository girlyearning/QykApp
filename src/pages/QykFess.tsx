import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { Folder, Plus, Search, Lock } from "lucide-react";

interface Confession {
  id: string;
  content: string;
  timestamp: Date;
  folder?: string;
}

const QykFess = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [currentConfession, setCurrentConfession] = useState("");
  const [folders, setFolders] = useState<string[]>(["Private", "Secrets", "Thoughts"]);
  const [selectedFolder, setSelectedFolder] = useState("Private");

  const handleSubmit = () => {
    if (currentConfession.trim() && currentConfession.length <= 350) {
      const newConfession: Confession = {
        id: Date.now().toString(),
        content: currentConfession.trim(),
        timestamp: new Date(),
        folder: selectedFolder,
      };
      setConfessions([newConfession, ...confessions]);
      setCurrentConfession("");
    }
  };

  const deleteConfession = (id: string) => {
    setConfessions(confessions.filter(confession => confession.id !== id));
  };

  const filteredConfessions = confessions.filter(confession => 
    !selectedFolder || confession.folder === selectedFolder
  );

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-safe">
          <h1 className="text-3xl font-bold text-primary">QykFess</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Private confessions and secret thoughts (350 chars)
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="glass-card p-4 rounded-3xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 text-primary">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Your confessions are private and stored locally
            </span>
          </div>
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
            value={currentConfession}
            onChange={setCurrentConfession}
            placeholder="Share your confession safely..."
            maxLength={350}
            rows={4}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-muted-foreground">
              {currentConfession.length}/350 characters
            </span>
            <Button 
              onClick={handleSubmit}
              disabled={!currentConfession.trim() || currentConfession.length > 350}
              className="rounded-full px-6 h-9"
            >
              Confess
            </Button>
          </div>
        </div>

        {/* Confessions List */}
        <div className="space-y-3">
          {filteredConfessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No confessions yet. Share what's on your mind.</p>
            </div>
          ) : (
            filteredConfessions.map((confession) => (
              <ContentCard
                key={confession.id}
                title="Anonymous Confession"
                content={confession.content}
                timestamp={confession.timestamp}
                onDelete={() => deleteConfession(confession.id)}
                type="confession"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QykFess;