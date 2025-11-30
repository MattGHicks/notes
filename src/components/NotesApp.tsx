"use client";

import { useNotes } from "@/hooks/useNotes";
import { Sidebar } from "./Sidebar";
import { Editor } from "./Editor";
import { ThemeToggle } from "./ThemeToggle";
import { FileTextIcon, Loader2Icon } from "lucide-react";

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
  } = useNotes();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2Icon className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <FileTextIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notes
          </h1>
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
        <Editor note={selectedNote} onUpdateNote={updateNote} />
      </div>
    </div>
  );
}
