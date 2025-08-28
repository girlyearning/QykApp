import { forwardRef, useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface QykInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
  onFocusPopup?: () => void; // optional hook to open compose popup
  autoFocus?: boolean;
}

const QykInput = forwardRef<HTMLTextAreaElement, QykInputProps>(
  ({ value, onChange, placeholder, maxLength, rows = 4, className, onFocusPopup, autoFocus }, ref) => {
    const areaRef = useRef<HTMLTextAreaElement | null>(null);
    const [showSheet, setShowSheet] = useState(false);

    const applyWrap = (wrapper: (text: string) => string) => {
      const el = areaRef.current;
      if (!el) return;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const before = value.slice(0, start);
      const sel = value.slice(start, end);
      const after = value.slice(end);
      const wrapped = wrapper(sel || "");
      const next = `${before}${wrapped}${after}`;
      onChange(next);
      const cursor = before.length + wrapped.length;
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(cursor, cursor);
      });
    };

    const bold = () => applyWrap((t) => `**${t || 'bold'}**`);
    const italic = () => applyWrap((t) => `*${t || 'italic'}*`);
    const underline = () => applyWrap((t) => `<u>${t || 'underline'}</u>`); // rehype-raw handles <u>
    const strike = () => applyWrap((t) => `~~${t || 'strike'}~~`);
    const bullet = () => applyWrap((t) => `\n- ${t || 'list item'}`);
    const number = () => applyWrap((t) => `\n1. ${t || 'numbered item'}`);

    // Hide sheet on escape
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowSheet(false); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
      <div className="relative">
        <Textarea
          ref={(node) => {
            if (typeof ref === 'function') ref(node as any);
            else if (ref) (ref as any).current = node;
            areaRef.current = node;
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { if (onFocusPopup) onFocusPopup(); }}
          onBlur={() => setTimeout(() => { setShowSheet(false); }, 150)}
          autoFocus={autoFocus}
          onContextMenu={(e) => {
            // Long-press/right-click -> show format sheet instead of browser menu
            e.preventDefault();
            const el = areaRef.current;
            if (!el) return;
            const start = el.selectionStart ?? 0;
            const end = el.selectionEnd ?? 0;
            if (end > start) setShowSheet(true);
          }}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={cn(
            "qyk-chat-input border-0 bg-muted/50 rounded-2xl p-4 text-[1.0625rem] resize-none",
            // Match sent post body spacing
            "leading-relaxed font-condensed whitespace-pre-wrap",
            "placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-primary/50",
            "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
            className
          )}
        />
        {showSheet && (
          <div className="fixed inset-0 z-50" onClick={() => setShowSheet(false)}>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 border border-border rounded-2xl shadow-lg p-2 flex gap-2" onClick={(e)=>e.stopPropagation()}>
              <button type="button" className="px-3 py-1 text-sm rounded hover:bg-muted" onMouseDown={(e)=>e.preventDefault()} onClick={() => { bold(); setShowSheet(false); }}><strong>B</strong></button>
              <button type="button" className="px-3 py-1 text-sm rounded hover:bg-muted italic" onMouseDown={(e)=>e.preventDefault()} onClick={() => { italic(); setShowSheet(false); }}>I</button>
              <button type="button" className="px-3 py-1 text-sm rounded hover:bg-muted underline" onMouseDown={(e)=>e.preventDefault()} onClick={() => { underline(); setShowSheet(false); }}>U</button>
              <button type="button" className="px-3 py-1 text-sm rounded hover:bg-muted line-through" onMouseDown={(e)=>e.preventDefault()} onClick={() => { strike(); setShowSheet(false); }}>S</button>
              <button type="button" className="px-3 py-1 text-sm rounded hover:bg-muted" title="Bullet list" onMouseDown={(e)=>e.preventDefault()} onClick={() => { bullet(); setShowSheet(false); }}>•</button>
              <button type="button" className="px-3 py-1 text-sm rounded hover:bg-muted" title="Numbered list" onMouseDown={(e)=>e.preventDefault()} onClick={() => { number(); setShowSheet(false); }}>1.</button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

QykInput.displayName = "QykInput";

export { QykInput };