import { DayGroup, EditorNote } from '../types';

const STORAGE_KEYS = {
  RECORDINGS: 'mimal-note-speech-recordings',
  EDITOR_NOTES: 'mimal-note-speech-editor-notes',
};

export const storageService = {
  // Recording storage
  getRecordings: (): DayGroup[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECORDINGS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return parsed.map((group: any) => ({
        ...group,
        notes: group.notes.map((note: any) => ({
          ...note,
          timestamp: new Date(note.timestamp),
        })),
      }));
    } catch (error) {
      console.error('Error loading recordings:', error);
      return [];
    }
  },

  saveRecordings: (recordings: DayGroup[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(recordings));
    } catch (error) {
      console.error('Error saving recordings:', error);
    }
  },

  addRecording: (note: DayGroup['notes'][0]): void => {
    const recordings = storageService.getRecordings();
    const today = new Date().toISOString().split('T')[0];
    
    let dayGroup = recordings.find((g) => g.date === today);
    if (!dayGroup) {
      dayGroup = { date: today, notes: [] };
      recordings.push(dayGroup);
    }
    
    dayGroup.notes.push(note);
    storageService.saveRecordings(recordings);
  },

  // Editor notes storage
  getEditorNotes: (): EditorNote[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EDITOR_NOTES);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return parsed.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading editor notes:', error);
      return [];
    }
  },

  saveEditorNote: (note: EditorNote): void => {
    try {
      const notes = storageService.getEditorNotes();
      const index = notes.findIndex((n) => n.id === note.id);
      if (index >= 0) {
        notes[index] = { ...note, updatedAt: new Date() };
      } else {
        notes.push(note);
      }
      localStorage.setItem(STORAGE_KEYS.EDITOR_NOTES, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving editor note:', error);
    }
  },

  deleteEditorNote: (id: string): void => {
    try {
      const notes = storageService.getEditorNotes();
      const filtered = notes.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEYS.EDITOR_NOTES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting editor note:', error);
    }
  },
};

