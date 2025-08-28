import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QykInput } from "@/components/QykInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ComposePopupProps {
  isOpen: boolean;
  onClose: () => void;
  heading: string; // e.g., QykNote, QykFess, QykWrite, QykQueries
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  buttonLabel: string; // e.g., Post Note, Confess, Save Entry, Answer
  // Optional title input (for QykWrite)
  showTitleInput?: boolean;
  titleValue?: string;
  onTitleChange?: (value: string) => void;
  titlePlaceholder?: string;
  onSubmit: () => Promise<void> | void;
  // Optional slot to render actions like attachments (e.g., Paperclip)
  attachmentSlot?: React.ReactNode;
}

export const ComposePopup: React.FC<ComposePopupProps> = ({
  isOpen,
  onClose,
  heading,
  value,
  onChange,
  placeholder,
  maxLength,
  buttonLabel,
  showTitleInput,
  titleValue,
  onTitleChange,
  titlePlaceholder,
  onSubmit,
  attachmentSlot,
}) => {
  const charCount = maxLength
    ? `${value.length}/${maxLength}`
    : `${value.length} characters`;
  const isWrite = heading === "QykWrite";
  const isNoteOrFess = heading === "QykNote" || heading === "QykFess";
  const isQuery = heading === "QykQueries";
  const shouldPositionUnderTop = isWrite || isNoteOrFess || isQuery;
  
  const shellWidthClasses = isWrite
    ? "w-[86vw] max-w-[38rem] rounded-2xl"
    : "w-[86vw] max-w-[40rem] rounded-3xl";
  const bodyMaxH = isWrite ? "min(48dvh, 50vh)" : "min(58dvh, 60vh)";
  const isCondensed = isWrite || isQuery;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className={`glass-card border-2 border-primary/60 overflow-hidden ${shellWidthClasses} pb-safe`}
        style={{
          marginBottom: isCondensed 
            ? 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' 
            : 'env(safe-area-inset-bottom, 0px)',
          maxHeight: isCondensed 
            ? 'calc(100vh - env(safe-area-inset-bottom, 0px) - 3rem)' 
            : 'calc(100vh - env(safe-area-inset-bottom, 0px) - 2rem)',
          ...(shouldPositionUnderTop && {
            top: 'calc(env(safe-area-inset-top, 0px) + 2rem)',
            transform: 'translateX(-50%)',
            left: '50%',
          }),
        }}
      >
        <DialogHeader>
          <DialogTitle className={`font-bold font-display font-condensed ${isQuery ? 'text-base leading-tight' : 'text-lg'}`}>
            {heading}
          </DialogTitle>
        </DialogHeader>

        {/* Body content scrolls; footer remains visible */}
        <div
          className={`overflow-auto px-2 pb-1 ${isCondensed ? 'pt-2' : 'pt-3'}`}
          style={{
            maxHeight: bodyMaxH,
          }}
        >
          {showTitleInput && (
            <Input
              value={titleValue || ""}
              onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
              placeholder={titlePlaceholder || "Title"}
              className={`border border-border/50 bg-muted/40 rounded-2xl h-11 px-4 text-base font-medium placeholder:text-muted-foreground/70 font-condensed ${isCondensed ? 'mb-2' : 'mb-3'} focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:outline-none`}
            />
          )}

          <QykInput
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={showTitleInput ? (isWrite ? 5 : 6) : 4}
            className={(showTitleInput ? "min-h-24" : "min-h-20") + ` ${isCondensed ? 'mt-1' : 'mt-2'}`}
            autoFocus
          />

          {/* Character counter and optional attachment action inline under the input */}
          <div className={`flex justify-between items-center ${isCondensed ? 'mt-1' : 'mt-2'}`}>
            <span className="text-xs text-muted-foreground font-condensed">
              {charCount}
            </span>
            {attachmentSlot && (
              <div className="flex items-center gap-2">{attachmentSlot}</div>
            )}
          </div>
        </div>

        <div className={`${isCondensed ? 'mt-0' : 'mt-1'} space-y-1 sticky bottom-1 bg-card ${isCondensed ? 'pt-0 pb-1' : 'pt-1 pb-1'} px-1`}>
          <Button
            className="w-full rounded-full h-10 font-condensed"
            onClick={async () => {
              await onSubmit();
              onClose();
            }}
            disabled={
              !value.trim() ||
              (showTitleInput ? !(titleValue || "").trim() : false)
            }
          >
            {buttonLabel}
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full h-10 font-condensed"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
