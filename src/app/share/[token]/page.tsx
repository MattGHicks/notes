"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LeafIcon, AlertCircleIcon } from "lucide-react";

interface SharedNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function SharedNotePage() {
  const params = useParams();
  const token = params.token as string;
  const [note, setNote] = useState<SharedNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await fetch(`/api/shared/${token}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("This note doesn't exist or is no longer shared.");
          } else {
            setError("Something went wrong loading this note.");
          }
          return;
        }
        const data = await res.json();
        setNote(data);
      } catch {
        setError("Failed to load note. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchNote();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-forest-950 flex items-center justify-center">
        <div className="animate-pulse-soft">
          <LeafIcon className="w-8 h-8 text-sage-500" />
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-forest-950 flex items-center justify-center">
        <div className="text-center max-w-md px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 mb-6">
            <AlertCircleIcon className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-display font-medium text-forest-800 dark:text-cream-100 mb-2">
            Note not found
          </h1>
          <p className="text-forest-700/60 dark:text-cream-300/60 leading-relaxed">
            {error || "This note doesn't exist or is no longer shared."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cream-200 dark:border-forest-800 bg-white/80 dark:bg-forest-900/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sage-100 dark:bg-sage-900/40 flex items-center justify-center">
              <LeafIcon className="w-4 h-4 text-sage-600 dark:text-sage-400" />
            </div>
            <span className="text-sm text-forest-700/60 dark:text-cream-300/60">
              Shared Note
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-8 py-12 animate-fadeIn">
        <h1 className="text-3xl font-display font-medium text-forest-800 dark:text-cream-100 mb-6 tracking-tight">
          {note.title || "Untitled"}
        </h1>
        <div className="w-12 h-1 bg-sage-300 dark:bg-sage-700 rounded-full mb-8" />
        <div className="text-sm text-forest-700/50 dark:text-cream-300/50 mb-8">
          Last updated {new Date(note.updatedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <article
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-200 dark:border-forest-800 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-forest-700/40 dark:text-cream-300/40">
            Created with Notes
          </p>
        </div>
      </footer>
    </div>
  );
}
