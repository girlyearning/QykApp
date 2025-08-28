import { ArrowLeft, Folder, Plus, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { hapticImpact } from "@/lib/haptics";

interface ModernTitleWidgetProps {
  title: string;
  description: string;
  onCreateFolder?: () => void;
  onViewFolders?: () => void;
  showFolderActions?: boolean;
  canGoBack?: boolean;
  onBack?: () => void;
  backRoute?: string;
  onOpenFavorites?: () => void;
}

const ModernTitleWidget = ({
  title,
  description,
  onCreateFolder,
  onViewFolders,
  showFolderActions = false,
  canGoBack = false,
  onBack,
  backRoute,
  onOpenFavorites,
}: ModernTitleWidgetProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };


  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6 animate-fade-in">
      <div className="glass-card p-6 rounded-3xl border-2 border-primary/50 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 shadow-lg ring-1 ring-primary/20">
        {/* Navigation Buttons - Top Left */}
        <div className="absolute top-4 left-4 flex gap-2">
          {canGoBack && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-background/50 hover:bg-background/80"
              onClick={async () => { try { await hapticImpact('light') } catch {}; handleBack(); }}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Folder Actions - Top Right */}
        {showFolderActions && (
          <div className="absolute top-4 right-4 flex flex-col items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0 bg-background/50 hover:bg-background/80"
                >
                  <Folder className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 bg-background border border-border/50 rounded-xl shadow-lg backdrop-blur-sm">
                {onCreateFolder && (
                  <DropdownMenuItem onClick={onCreateFolder} className="cursor-pointer rounded-lg hover:bg-primary/10 focus:bg-primary/10">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Folder
                  </DropdownMenuItem>
                )}
                {onViewFolders && (
                  <DropdownMenuItem onClick={onViewFolders} className="cursor-pointer rounded-lg hover:bg-primary/10 focus:bg-primary/10">
                    <Eye className="w-4 h-4 mr-2" />
                    View Folders
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {onOpenFavorites && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-8 h-8 p-0 bg-background/60 hover:bg-background/80"
                onClick={async () => { try { await hapticImpact('light') } catch {}; onOpenFavorites?.(); }}
                title="Open Favorites"
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Top-right Favorites button when no folder actions */}
        {!showFolderActions && onOpenFavorites && (
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-background/60 hover:bg-background/80"
              onClick={async () => { try { await hapticImpact('light') } catch {}; onOpenFavorites?.(); }}
              title="Open Favorites"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Centered Content */}
        <div className="text-center px-12">
          <h1 className="text-title-3xl font-bold text-primary font-display font-extra-condensed mb-2">
            {title}
          </h1>
          <p className="text-title-sm text-muted-foreground font-medium font-condensed">
            {description}
          </p>
          
        </div>
      </div>
    </div>
  );
};

export { ModernTitleWidget };