import { ArrowLeft, ArrowRight, Folder, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface ModernTitleWidgetProps {
  title: string;
  description: string;
  onCreateFolder?: () => void;
  onViewFolders?: () => void;
  showFolderActions?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  backRoute?: string;
  forwardRoute?: string;
}

const ModernTitleWidget = ({
  title,
  description,
  onCreateFolder,
  onViewFolders,
  showFolderActions = false,
  canGoBack = false,
  canGoForward = false,
  onBack,
  onForward,
  backRoute,
  forwardRoute,
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

  const handleForward = () => {
    if (onForward) {
      onForward();
    } else if (forwardRoute) {
      navigate(forwardRoute);
    } else {
      navigate(1);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6 animate-fade-in">
      <div className="glass-card p-6 rounded-3xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 shadow-lg">
        {/* Navigation Buttons - Top Left */}
        <div className="absolute top-4 left-4 flex gap-2">
          {canGoBack && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-background/50 hover:bg-background/80"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          {canGoForward && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-background/50 hover:bg-background/80"
              onClick={handleForward}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Folder Actions - Top Right */}
        {showFolderActions && (
          <div className="absolute top-4 right-4">
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
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border border-border/50">
                {onCreateFolder && (
                  <DropdownMenuItem onClick={onCreateFolder} className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Folder
                  </DropdownMenuItem>
                )}
                {onViewFolders && (
                  <DropdownMenuItem onClick={onViewFolders} className="cursor-pointer">
                    <Eye className="w-4 h-4 mr-2" />
                    View Folders
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Centered Content */}
        <div className="text-center px-12">
          <h1 className="text-3xl font-bold text-primary font-space font-extra-condensed mb-2">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground font-medium font-condensed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export { ModernTitleWidget };