import { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface QykInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
}

const QykInput = forwardRef<HTMLTextAreaElement, QykInputProps>(
  ({ value, onChange, placeholder, maxLength, rows = 4, className }, ref) => {
    return (
      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className={cn(
          "border-0 bg-muted/50 rounded-2xl p-4 text-base resize-none",
          "placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-primary/50",
          "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
          className
        )}
      />
    );
  }
);

QykInput.displayName = "QykInput";

export { QykInput };