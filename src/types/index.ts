export interface NoteItem {
  id: string;
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface DayGroup {
  date: string; // YYYY-MM-DD format
  notes: NoteItem[];
}

export interface EditorNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

