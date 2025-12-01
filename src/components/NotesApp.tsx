"use client";

import { useNotes } from "@/hooks/useNotes";
import { Sidebar } from "./Sidebar";
import { Editor } from "./Editor";
import { ThemeToggle } from "./ThemeToggle";

export function NotesApp() {
  const {
    notes,
    folders,
    selectedNote,
    selectedFolderId,
    searchQuery,
    loading,
    setSelectedNote,
    setSelectedFolderId,
    setSearchQuery,
    createNote,
    updateNote,
    deleteNote,
    createFolder,
    updateFolder,
    deleteFolder,
    shareNote,
    unshareNote,
  } = useNotes();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-cream-50 dark:bg-forest-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-sage-200 dark:border-sage-800" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-sage-500 border-t-transparent animate-spin" />
          </div>
          <span className="text-sm text-forest-700 dark:text-cream-300 font-medium">
            Loading your notes...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-cream-50 dark:bg-forest-950 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-cream-300 dark:border-forest-700 bg-white/80 dark:bg-forest-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Leaf Logo */}
          <div className="relative w-9 h-9 flex items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 4C16 4 8 8 8 18C8 24 12 28 16 28C20 28 24 24 24 18C24 8 16 4 16 4Z"
                className="fill-sage-500 dark:fill-sage-400"
              />
              <path
                d="M16 8V24M16 12C14 14 12 16 12 18M16 16C18 17 20 18 20 19"
                className="stroke-sage-200 dark:stroke-sage-700"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-forest-800 dark:text-cream-100 tracking-tight">
              Notes
            </h1>
            <p className="text-xs text-forest-700/60 dark:text-cream-300/60 -mt-0.5">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          folders={folders}
          notes={notes}
          selectedNote={selectedNote}
          selectedFolderId={selectedFolderId}
          searchQuery={searchQuery}
          onSelectNote={setSelectedNote}
          onSelectFolder={setSelectedFolderId}
          onSearch={setSearchQuery}
          onCreateNote={() => createNote()}
          onCreateFolder={createFolder}
          onDeleteNote={deleteNote}
          onDeleteFolder={deleteFolder}
          onRenameFolder={updateFolder}
        />
        <Editor
          note={selectedNote}
          onUpdateNote={updateNote}
          onShareNote={shareNote}
          onUnshareNote={unshareNote}
        />
      </div>
    </div>
  );
}
