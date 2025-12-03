import { useEffect, useState } from 'react';
import { EditorNote } from '../types';
import { storageService } from '../utils/storage';

interface NoteListProps {
  onSelectNote: (noteId: string) => void;
  onNewNote: () => void;
}

export const NoteList = ({ onSelectNote, onNewNote }: NoteListProps) => {
  const [notes, setNotes] = useState<EditorNote[]>([]);

  const loadNotes = () => {
    const data = storageService.getEditorNotes();
    setNotes(data.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('คุณต้องการลบเอกสารนี้หรือไม่?')) {
      storageService.deleteEditorNote(id);
      loadNotes();
      onSelectNote('');
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">รายการเอกสาร</h5>
        <button
          className="btn btn-primary btn-sm"
          onClick={onNewNote}
        >
          <i className="bi bi-plus-circle me-1"></i>
          สร้างใหม่
        </button>
      </div>
      <div className="card-body">
        {notes.length === 0 ? (
          <p className="text-muted text-center py-4">
            ยังไม่มีเอกสาร
          </p>
        ) : (
          <div className="list-group">
            {notes.map((note) => (
              <div
                key={note.id}
                className="list-group-item list-group-item-action cursor-pointer"
                onClick={() => onSelectNote(note.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex w-100 justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{note.title}</h6>
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      อัปเดต: {formatDate(note.updatedAt)}
                    </small>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={(e) => handleDelete(note.id, e)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

