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
  ChevronDownIcon,
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
    <div className="w-72 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex gap-2">
        <button
          onClick={onCreateNote}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          New Note
        </button>
        <button
          onClick={() => setShowNewFolderInput(true)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="New Folder"
        >
          <FolderPlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* New Folder Input */}
      {showNewFolderInput && (
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800">
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
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      )}

      {/* Folders & Notes */}
      <div className="flex-1 overflow-y-auto">
        {/* All Notes */}
        <button
          onClick={() => onSelectFolder(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            selectedFolderId === null && !searchQuery
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          <FileTextIcon className="w-4 h-4" />
          <span className="flex-1">All Notes</span>
          <span className="text-xs text-gray-400">{notes.length}</span>
        </button>

        {/* Folders */}
        {folders.map((folder) => {
          const isExpanded = expandedFolders.has(folder.id);
          const folderNotes = notes.filter((n) => n.folderId === folder.id);

          return (
            <div key={folder.id}>
              <div
                className={`group flex items-center gap-1 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  selectedFolderId === folder.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onSelectFolder(folder.id)}
                  className="flex-1 flex items-center gap-2 text-left"
                >
                  <FolderIcon className="w-4 h-4" />
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
                      className="flex-1 px-1 py-0 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="flex-1 truncate">{folder.name}</span>
                  )}
                </button>
                <span className="text-xs text-gray-400">{folderNotes.length}</span>
                <div className="hidden group-hover:flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFolderId(folder.id);
                      setEditingFolderName(folder.name);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <PencilIcon className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(folder.id);
                    }}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Folder Notes */}
              {isExpanded && (
                <div className="ml-6 border-l border-gray-200 dark:border-gray-700">
                  {folderNotes.map((note) => (
                    <NoteItem
                      key={note.id}
                      note={note}
                      isSelected={selectedNote?.id === note.id}
                      onSelect={() => onSelectNote(note)}
                      onDelete={() => onDeleteNote(note.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Unfiled Notes */}
        {unfiledNotes.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">
              Unfiled
            </div>
            {unfiledNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isSelected={selectedNote?.id === note.id}
                onSelect={() => onSelectNote(note)}
                onDelete={() => onDeleteNote(note.id)}
              />
            ))}
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
}: {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`group w-full flex items-start gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          : "text-gray-700 dark:text-gray-300"
      }`}
    >
      <FileTextIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{note.title || "Untitled"}</div>
        <div className="text-xs text-gray-400 truncate">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="hidden group-hover:block p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded"
      >
        <TrashIcon className="w-3 h-3" />
      </button>
    </button>
  );
}
