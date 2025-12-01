"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Note } from "@/types";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  Heading1Icon,
  Heading2Icon,
  CodeIcon,
  QuoteIcon,
  Undo2Icon,
  Redo2Icon,
  PenLineIcon,
  Share2Icon,
  CopyIcon,
  CheckIcon,
  XIcon,
  ExternalLinkIcon,
} from "lucide-react";

interface EditorProps {
  note: Note | null;
  onUpdateNote: (id: string, data: Partial<Note>) => void;
  onShareNote: (id: string) => Promise<string>;
  onUnshareNote: (id: string) => Promise<void>;
}

export function Editor({ note, onUpdateNote, onShareNote, onUnshareNote }: EditorProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: note?.content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[calc(100vh-200px)]",
      },
    },
    onUpdate: ({ editor }) => {
      if (!note) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        onUpdateNote(note.id, { content: editor.getHTML() });
      }, 500);
    },
  });

  useEffect(() => {
    if (editor && note) {
      if (editor.getHTML() !== note.content) {
        editor.commands.setContent(note.content || "");
      }
    }
  }, [note?.id, editor]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!note) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        onUpdateNote(note.id, { title: e.target.value });
      }, 500);
    },
    [note, onUpdateNote]
  );

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cream-50 dark:bg-forest-950">
        <div className="text-center max-w-md px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sage-100 dark:bg-sage-900/30 mb-6">
            <PenLineIcon className="w-8 h-8 text-sage-600 dark:text-sage-400" />
          </div>
          <h2 className="text-xl font-display font-medium text-forest-800 dark:text-cream-100 mb-2">
            Ready to write?
          </h2>
          <p className="text-forest-700/60 dark:text-cream-300/60 leading-relaxed">
            Select a note from the sidebar or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cream-50 dark:bg-forest-950">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2.5 border-b border-cream-200 dark:border-forest-800 bg-white/60 dark:bg-forest-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-0.5 p-1 bg-cream-100 dark:bg-forest-800 rounded-lg">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            isActive={editor?.isActive("bold")}
            title="Bold"
          >
            <BoldIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            isActive={editor?.isActive("italic")}
            title="Italic"
          >
            <ItalicIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-cream-300 dark:bg-forest-700 mx-1" />

        <div className="flex items-center gap-0.5 p-1 bg-cream-100 dark:bg-forest-800 rounded-lg">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor?.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1Icon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor?.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2Icon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-cream-300 dark:bg-forest-700 mx-1" />

        <div className="flex items-center gap-0.5 p-1 bg-cream-100 dark:bg-forest-800 rounded-lg">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            isActive={editor?.isActive("bulletList")}
            title="Bullet List"
          >
            <ListIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            isActive={editor?.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrderedIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-cream-300 dark:bg-forest-700 mx-1" />

        <div className="flex items-center gap-0.5 p-1 bg-cream-100 dark:bg-forest-800 rounded-lg">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            isActive={editor?.isActive("codeBlock")}
            title="Code Block"
          >
            <CodeIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            isActive={editor?.isActive("blockquote")}
            title="Quote"
          >
            <QuoteIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-0.5 p-1 bg-cream-100 dark:bg-forest-800 rounded-lg">
          <ToolbarButton
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            title="Undo"
          >
            <Undo2Icon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            title="Redo"
          >
            <Redo2Icon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-cream-300 dark:bg-forest-700 mx-1" />

        <button
          onClick={() => setShowShareModal(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            note.shareToken
              ? "bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300"
              : "bg-cream-100 dark:bg-forest-800 text-forest-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-forest-700"
          }`}
          title="Share note"
        >
          <Share2Icon className="w-4 h-4" />
          <span className="text-sm font-medium">
            {note.shareToken ? "Shared" : "Share"}
          </span>
        </button>
      </div>

      {/* Title & Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-10">
          <input
            ref={titleRef}
            type="text"
            defaultValue={note.title}
            key={note.id}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-3xl font-display font-medium bg-transparent border-none focus:outline-none text-forest-800 dark:text-cream-100 placeholder-forest-700/30 dark:placeholder-cream-300/30 mb-6 tracking-tight"
          />
          <div className="w-12 h-1 bg-sage-300 dark:bg-sage-700 rounded-full mb-8" />
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          note={note}
          onClose={() => {
            setShowShareModal(false);
            setCopied(false);
          }}
          onShare={async () => {
            setSharing(true);
            await onShareNote(note.id);
            setSharing(false);
          }}
          onUnshare={async () => {
            setSharing(true);
            await onUnshareNote(note.id);
            setSharing(false);
          }}
          copied={copied}
          onCopy={() => {
            const url = `${window.location.origin}/share/${note.shareToken}`;
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          sharing={sharing}
        />
      )}
    </div>
  );
}

function ShareModal({
  note,
  onClose,
  onShare,
  onUnshare,
  copied,
  onCopy,
  sharing,
}: {
  note: Note;
  onClose: () => void;
  onShare: () => void;
  onUnshare: () => void;
  copied: boolean;
  onCopy: () => void;
  sharing: boolean;
}) {
  const shareUrl = note.shareToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${note.shareToken}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-forest-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-forest-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideIn">
        <div className="flex items-center justify-between p-5 border-b border-cream-200 dark:border-forest-700">
          <h2 className="text-lg font-display font-semibold text-forest-800 dark:text-cream-100">
            Share Note
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-forest-800 text-forest-700 dark:text-cream-300 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {note.shareToken ? (
            <div className="space-y-4">
              <p className="text-sm text-forest-700 dark:text-cream-300">
                Anyone with this link can view this note.
              </p>

              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-cream-100 dark:bg-forest-800 rounded-lg border border-cream-300 dark:border-forest-700">
                  <span className="text-sm text-forest-700 dark:text-cream-300 truncate flex-1">
                    {shareUrl}
                  </span>
                </div>
                <button
                  onClick={onCopy}
                  className="flex items-center gap-2 px-4 py-2.5 bg-sage-500 hover:bg-sage-600 text-white rounded-lg transition-colors font-medium"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={shareUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-sage-600 dark:text-sage-400 hover:underline"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  Open in new tab
                </a>
                <button
                  onClick={onUnshare}
                  disabled={sharing}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                >
                  {sharing ? "Removing..." : "Remove link"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-forest-700 dark:text-cream-300">
                Create a public link to share this note with anyone.
              </p>
              <button
                onClick={onShare}
                disabled={sharing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sage-500 hover:bg-sage-600 disabled:bg-sage-400 text-white rounded-xl transition-colors font-medium"
              >
                <Share2Icon className="w-4 h-4" />
                {sharing ? "Creating link..." : "Create share link"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  isActive,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-all ${
        isActive
          ? "bg-sage-200 dark:bg-sage-800/50 text-sage-700 dark:text-sage-300 shadow-inner-soft"
          : "text-forest-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-forest-700"
      } ${disabled ? "opacity-30 cursor-not-allowed" : "active:scale-95"}`}
    >
      {children}
    </button>
  );
}
