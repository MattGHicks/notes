"use client";

import { useState } from "react";
import { Folder, Note } from "@/types";
import {
  FolderIcon,
  FolderPlusIcon,
  FileTextIcon,
  SearchIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  selectedNote: Note | null;
  selectedFolderId: string | null;
  searchQuery: string;
  onSelectNote: (note: Note) => void;
  onSelectFolder: (folderId: string | null) => void;
  onSearch: (query: string) => void;
  onCreateNote: () => void;
  onCreateFolder: (name: string) => void;
  onDeleteNote: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, name: string) => void;
}

export function Sidebar({
  folders,
  notes,
  selectedNote,
  selectedFolderId,
  searchQuery,
  onSelectNote,
  onSelectFolder,
  onSearch,
  onCreateNote,
  onCreateFolder,
  onDeleteNote,
  onDeleteFolder,
  onRenameFolder,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setShowNewFolderInput(false);
    }
  };

  const handleRenameFolder = (id: string) => {
    if (editingFolderName.trim()) {
      onRenameFolder(id, editingFolderName.trim());
    }
    setEditingFolderId(null);
  };

  const unfiledNotes = notes.filter((n) => !n.folderId);

  return (
    <div className="w-72 bg-cream-100/50 dark:bg-forest-900/50 border-r border-cream-300 dark:border-forest-700 flex flex-col h-full">
      {/* Search */}
      <div className="p-4">
        <div className="relative group">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-700/40 dark:text-cream-300/40 transition-colors group-focus-within:text-sage-600 dark:group-focus-within:text-sage-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-forest-800 border border-cream-300 dark:border-forest-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-500 dark:focus:border-sage-400 text-forest-800 dark:text-cream-100 placeholder-forest-700/40 dark:placeholder-cream-300/40 transition-all shadow-inner-soft"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={onCreateNote}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 rounded-xl transition-all shadow-soft hover:shadow-soft-lg active:scale-[0.98]"
        >
          <PlusIcon className="w-4 h-4" />
          New Note
        </button>
        <button
          onClick={() => setShowNewFolderInput(true)}
          className="p-2.5 text-forest-700 dark:text-cream-300 bg-white dark:bg-forest-800 hover:bg-sage-100 dark:hover:bg-sage-900/30 border border-cream-300 dark:border-forest-700 rounded-xl transition-all hover:border-sage-400 dark:hover:border-sage-600"
          title="New Folder"
        >
          <FolderPlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* New Folder Input */}
      {showNewFolderInput && (
        <div className="px-4 pb-3 animate-slideIn">
          <input
            type="text"
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFolder();
              if (e.key === "Escape") setShowNewFolderInput(false);
            }}
            onBlur={handleCreateFolder}
            autoFocus
            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-forest-800 border-2 border-sage-400 dark:border-sage-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500/30 text-forest-800 dark:text-cream-100 shadow-soft"
          />
        </div>
      )}

      {/* Folders & Notes */}
      <div className="flex-1 overflow-y-auto px-2">
        {/* All Notes */}
        <button
          onClick={() => onSelectFolder(null)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left rounded-xl transition-all mb-1 ${
            selectedFolderId === null && !searchQuery
              ? "bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 shadow-soft"
              : "text-forest-700 dark:text-cream-300 hover:bg-white/60 dark:hover:bg-forest-800/60"
          }`}
        >
          <div className={`p-1.5 rounded-lg ${
            selectedFolderId === null && !searchQuery
              ? "bg-sage-200 dark:bg-sage-800/50"
              : "bg-cream-200 dark:bg-forest-700"
          }`}>
            <SparklesIcon className="w-4 h-4" />
          </div>
          <span className="flex-1 font-medium">All Notes</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cream-200 dark:bg-forest-700 text-forest-700/70 dark:text-cream-300/70">
            {notes.length}
          </span>
        </button>

        {/* Folders */}
        {folders.map((folder) => {
          const isExpanded = expandedFolders.has(folder.id);
          const folderNotes = notes.filter((n) => n.folderId === folder.id);
          const isSelected = selectedFolderId === folder.id;

          return (
            <div key={folder.id} className="mb-1">
              <div
                className={`group flex items-center gap-1 px-2 py-2 text-sm rounded-xl transition-all ${
                  isSelected
                    ? "bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 shadow-soft"
                    : "text-forest-700 dark:text-cream-300 hover:bg-white/60 dark:hover:bg-forest-800/60"
                }`}
              >
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="p-1 hover:bg-cream-200 dark:hover:bg-forest-700 rounded-lg transition-colors"
                >
                  <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    <ChevronRightIcon className="w-4 h-4" />
                  </div>
                </button>
                <button
                  onClick={() => onSelectFolder(folder.id)}
                  className="flex-1 flex items-center gap-2 text-left min-w-0"
                >
                  <div className={`p-1.5 rounded-lg ${
                    isSelected
                      ? "bg-sage-200 dark:bg-sage-800/50"
                      : "bg-cream-200 dark:bg-forest-700"
                  }`}>
                    <FolderIcon className="w-4 h-4" />
                  </div>
                  {editingFolderId === folder.id ? (
                    <input
                      type="text"
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameFolder(folder.id);
                        if (e.key === "Escape") setEditingFolderId(null);
                      }}
                      onBlur={() => handleRenameFolder(folder.id)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="flex-1 px-2 py-0.5 text-sm bg-white dark:bg-forest-800 border border-sage-400 dark:border-sage-600 rounded-lg focus:outline-none min-w-0"
                    />
                  ) : (
                    <span className="flex-1 truncate font-medium">{folder.name}</span>
                  )}
                </button>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cream-200 dark:bg-forest-700 text-forest-700/70 dark:text-cream-300/70">
                  {folderNotes.length}
                </span>
                <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFolderId(folder.id);
                      setEditingFolderName(folder.name);
                    }}
                    className="p-1.5 hover:bg-cream-200 dark:hover:bg-forest-700 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(folder.id);
                    }}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Folder Notes */}
              {isExpanded && (
                <div className="ml-4 pl-4 border-l-2 border-cream-200 dark:border-forest-700 mt-1 space-y-0.5">
                  {folderNotes.map((note, index) => (
                    <NoteItem
                      key={note.id}
                      note={note}
                      isSelected={selectedNote?.id === note.id}
                      onSelect={() => onSelectNote(note)}
                      onDelete={() => onDeleteNote(note.id)}
                      style={{ animationDelay: `${index * 30}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Unfiled Notes */}
        {unfiledNotes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-cream-200 dark:border-forest-800">
            <div className="px-3 py-2 text-xs font-semibold text-forest-700/50 dark:text-cream-300/50 uppercase tracking-wider">
              Unfiled
            </div>
            <div className="space-y-0.5">
              {unfiledNotes.map((note, index) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isSelected={selectedNote?.id === note.id}
                  onSelect={() => onSelectNote(note)}
                  onDelete={() => onDeleteNote(note.id)}
                  style={{ animationDelay: `${index * 30}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteItem({
  note,
  isSelected,
  onSelect,
  onDelete,
  style,
}: {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onSelect}
      style={style}
      className={`group w-full flex items-start gap-3 px-3 py-2.5 text-sm text-left rounded-xl transition-all animate-fadeIn ${
        isSelected
          ? "bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-100 shadow-soft"
          : "text-forest-700 dark:text-cream-300 hover:bg-white/60 dark:hover:bg-forest-800/60"
      }`}
    >
      <div className={`p-1.5 rounded-lg mt-0.5 ${
        isSelected
          ? "bg-sage-100 dark:bg-sage-900/30"
          : "bg-cream-200/50 dark:bg-forest-700/50"
      }`}>
        <FileTextIcon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${isSelected ? 'text-forest-800 dark:text-cream-100' : ''}`}>
          {note.title || "Untitled"}
        </div>
        <div className="text-xs text-forest-700/50 dark:text-cream-300/50 truncate mt-0.5">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="hidden group-hover:flex p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-all"
      >
        <TrashIcon className="w-3.5 h-3.5" />
      </button>
    </button>
  );
}
