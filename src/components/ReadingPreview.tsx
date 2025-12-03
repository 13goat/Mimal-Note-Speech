import { useEffect, useState } from 'react';
import type { DayGroup } from '../types';
import { storageService } from '../utils/storage';

export const ReadingPreview = () => {
  const [recordings, setRecordings] = useState<DayGroup[]>([]);

  const loadRecordings = () => {
    const data = storageService.getRecordings();
    setRecordings(data);
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (timestamp: Date): string => {
    return new Date(timestamp).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">บันทึกเสียงที่บันทึกไว้</h5>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={loadRecordings}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          รีเฟรช
        </button>
      </div>
      <div className="card-body">
        {recordings.length === 0 ? (
          <p className="text-muted text-center py-4">
            ยังไม่มีบันทึกเสียง
          </p>
        ) : (
          <div className="list-group">
            {recordings.map((group) => (
              <div key={group.date} className="mb-4">
                <h6 className="text-primary mb-3">
                  <i className="bi bi-calendar-event me-2"></i>
                  {formatDate(group.date)}
                </h6>
                {group.notes.map((note) => (
                  <div key={note.id} className="list-group-item mb-2">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {formatTime(note.timestamp)}
                      </small>
                    </div>
                    <p className="mb-2">{note.content}</p>
                    {note.audioUrl && (
                      <audio
                        controls
                        src={note.audioUrl}
                        className="w-100"
                        style={{ maxWidth: '100%' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

