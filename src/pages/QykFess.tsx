import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { FolderManager } from "@/components/FolderManager";
import { Search, Lock } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useConfessions } from "@/hooks/useSupabaseData";

const QykFess = () => {
  const { confessions, loading, addConfession, deleteConfession } = useConfessions();
  const [currentConfession, setCurrentConfession] = useState("");
  const [newItemIds, setNewItemIds] = useState<string[]>([]);
  const [folders, setFolders] = useLocalStorage<string[]>("qyk-fess-folders", []);
  const [selectedFolder, setSelectedFolder] = useLocalStorage<string>("qyk-fess-selected-folder", "");

  const handleSubmit = async () => {
    if (currentConfession.trim() && currentConfession.length <= 350) {
      const newConfession = await addConfession(currentConfession.trim(), selectedFolder);
      if (newConfession) {
        setCurrentConfession("");
        setNewItemIds(prev => [...prev, newConfession.id]);
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteConfession(id);
  };

  const filteredConfessions = confessions.filter(confession => 
    !selectedFolder || confession.folder === selectedFolder
  );

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-safe animate-fade-in">
          <h1 className="text-3xl font-bold text-primary font-space font-extra-condensed">QykFess</h1>
          <p className="text-sm text-muted-foreground font-medium font-overused font-condensed">
            Private confessions and secret thoughts (350 chars)
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="glass-card p-4 rounded-3xl bg-primary/5 border border-primary/20 animate-slide-down">
          <div className="flex items-center gap-2 text-primary">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium font-overused font-condensed">
              Your confessions are private and stored locally
            </span>
          </div>
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
            value={currentConfession}
            onChange={setCurrentConfession}
            placeholder="Share your confession safely..."
            maxLength={350}
            rows={4}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-muted-foreground font-overused font-condensed">
              {currentConfession.length}/350 characters
            </span>
            <Button 
              onClick={handleSubmit}
              disabled={!currentConfession.trim() || currentConfession.length > 350}
              className="rounded-full px-6 h-9 font-overused font-condensed hover:scale-105 transition-transform duration-200"
            >
              Confess
            </Button>
          </div>
        </div>

        {/* Confessions List */}
        <div className="space-y-3 stagger-animation">
          {filteredConfessions.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-overused font-condensed">No confessions yet. Share what's on your mind.</p>
            </div>
          ) : (
            filteredConfessions.map((confession, index) => (
              <div
                key={confession.id}
                style={{ '--stagger-delay': index } as React.CSSProperties}
                className="animate-slide-up"
              >
                   <ContentCard
                    title="QykFess"
                    content={confession.content}
                    timestamp={new Date(confession.created_at)}
                    onDelete={() => handleDelete(confession.id)}
                    type="confession"
                    isNew={newItemIds.includes(confession.id)}
                  />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QykFess;