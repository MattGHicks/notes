"use client";

import { useState, useEffect, useCallback } from "react";
import { Note, Folder } from "@/types";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedFolderId) params.set("folderId", selectedFolderId);

    const res = await fetch(`/api/notes?${params}`);
    const data = await res.json();
    setNotes(data);
  }, [searchQuery, selectedFolderId]);

  const fetchFolders = useCallback(async () => {
    const res = await fetch("/api/folders");
    const data = await res.json();
    setFolders(data);
  }, []);

  useEffect(() => {
    Promise.all([fetchNotes(), fetchFolders()]).then(() => setLoading(false));
  }, [fetchNotes, fetchFolders]);

  const createNote = async (folderId?: string | null) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Untitled",
        content: "",
        folderId: folderId ?? selectedFolderId,
      }),
    });
    const note = await res.json();
    setNotes((prev) => [note, ...prev]);
    setSelectedNote(note);
    return note;
  };

  const updateNote = async (id: string, data: Partial<Note>) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    if (selectedNote?.id === id) {
      setSelectedNote(updated);
    }
    return updated;
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const createFolder = async (name: string) => {
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const folder = await res.json();
    setFolders((prev) => [...prev, folder].sort((a, b) => a.name.localeCompare(b.name)));
    return folder;
  };

  const updateFolder = async (id: string, name: string) => {
    const res = await fetch(`/api/folders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const updated = await res.json();
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? updated : f)).sort((a, b) => a.name.localeCompare(b.name))
    );
    return updated;
  };

  const deleteFolder = async (id: string) => {
    await fetch(`/api/folders/${id}`, { method: "DELETE" });
    setFolders((prev) => prev.filter((f) => f.id !== id));
    if (selectedFolderId === id) {
      setSelectedFolderId(null);
    }
    fetchNotes();
  };

  const shareNote = async (id: string) => {
    const res = await fetch(`/api/notes/${id}/share`, { method: "POST" });
    const { shareToken } = await res.json();
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, shareToken } : n)));
    if (selectedNote?.id === id) {
      setSelectedNote((prev) => prev ? { ...prev, shareToken } : null);
    }
    return shareToken;
  };

  const unshareNote = async (id: string) => {
    await fetch(`/api/notes/${id}/share`, { method: "DELETE" });
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, shareToken: null } : n)));
    if (selectedNote?.id === id) {
      setSelectedNote((prev) => prev ? { ...prev, shareToken: null } : null);
    }
  };

  return {
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
    refreshNotes: fetchNotes,
  };
}
