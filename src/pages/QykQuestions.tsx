import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QykInput } from "@/components/QykInput";
import { ContentCard } from "@/components/ContentCard";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { useQuestions } from "@/hooks/useQuestions";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen } from "lucide-react";

function formatIsoDateLocal(iso: string): string {
  // iso is yyyy-mm-dd. Build local date to avoid UTC parsing quirks
  const [y, m, d] = iso.split("-").map(Number);
  const local = new Date(y, (m || 1) - 1, d || 1);
  return local.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

const QykQuestions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentQuestion,
    answers,
    addAnswer,
    updateAnswer,
    deleteAnswer,
    todaysAnswer,
  } = useQuestions();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const [currentContent, setCurrentContent] = useState("");
  const [newItemIds, setNewItemIds] = useState<string[]>([]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2 font-display font-condensed">
              Sign in to access QykQuestions
            </h2>
            <p className="text-muted-foreground font-condensed mb-6">
              Your answers are synced across your devices
            </p>
            <Button
              onClick={() => navigate("/auth")}
              className="rounded-full px-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!currentContent.trim()) return;
    const created = await addAnswer(currentContent);
    if (created) {
      setCurrentContent("");
      setNewItemIds((prev) => [created.id, ...prev]);
    }
  };

  return (
    <div className="min-h-screen keyboard-aware bg-gradient-iridescent p-4 pb-safe">
      <div className="max-w-2xl mx-auto space-y-6 keyboard-aware-content">
        <div className="pt-safe pl-safe pr-safe">
          <ModernTitleWidget
            title="QykQuestions"
            description="Daily mindful questions"
            canGoBack={true}
            backRoute="/"
            onOpenFavorites={() => navigate('/favorites')}
          />
        </div>

        {/* Daily Question */}
        <div className="glass-card p-4 rounded-2xl animate-slide-down">
          <div className="text-center text-sm text-muted-foreground font-condensed mb-2">
            Today's question
          </div>
          <div className="text-center text-base font-medium text-foreground font-condensed max-w-prose mx-auto whitespace-pre-wrap">
            {currentQuestion.text}
          </div>
        </div>

        {/* Input Section */}
        {!todaysAnswer ? (
          <div className="glass-card p-6 rounded-3xl space-y-4 animate-slide-up hover-lift">
            <QykInput
              value={currentContent}
              onChange={setCurrentContent}
              placeholder="Write your answer..."
              rows={6}
              className="min-h-28"
            />
            <div className="flex justify-end items-center">
              <Button
                onClick={handleSubmit}
                disabled={!currentContent.trim()}
                className="rounded-full px-6 h-9 font-condensed hover:scale-105 transition-transform duration-200"
              >
                Answer
              </Button>
            </div>
          </div>
        ) : (
          <div className="glass-card p-4 rounded-2xl animate-slide-down">
            <div className="text-sm text-muted-foreground font-condensed text-center">
              You've answered today's question. You can edit your answer below.
            </div>
          </div>
        )}

        {/* Answers List */}
        <div className="space-y-3 stagger-animation">
          {answers.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-condensed">
                No answers yet. Share your thoughts!
              </p>
            </div>
          ) : (
            answers.map((ans, index) => (
              <div
                key={ans.id}
                style={{ "--stagger-delay": index } as CSSProperties}
                className="animate-slide-up"
              >
                <ContentCard
                  title={formatIsoDateLocal(ans.question_date)}
                  content={ans.content}
                  timestamp={new Date(ans.created_at)}
                  onDelete={() => deleteAnswer(ans.id)}
                  type="entry"
                  isNew={newItemIds.includes(ans.id)}
                  onUpdate={async (newContent) => {
                    await updateAnswer(ans.id, newContent);
                  }}
                  onAddFavorite={!isFavorited('question', ans.id) ? () => addFavorite('question', ans.id) : undefined}
                  onRemoveFavorite={isFavorited('question', ans.id) ? () => removeFavorite('question', ans.id) : undefined}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QykQuestions;
