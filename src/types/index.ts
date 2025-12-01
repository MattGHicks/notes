export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: { notes: number };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  folderId: string | null;
  folder: Folder | null;
  shareToken: string | null;
}
