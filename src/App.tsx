import { useState } from 'react';
import { Recorder } from './components/Recorder';
import { ReadingPreview } from './components/ReadingPreview';
import { Editor } from './components/Editor';
import { NoteList } from './components/NoteList';
import './App.css';

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRecordComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handleNewNote = () => {
    setSelectedNoteId('');
  };

  const handleEditorSave = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-5 mb-0">
            <i className="bi bi-mic me-2"></i>
            Mimal Note Speech
          </h1>
          <p className="text-muted">ระบบบันทึกเสียงและจัดทำรายงาน</p>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Recorder & Preview */}
        <div className="col-lg-6 mb-4">
          <Recorder onRecordComplete={handleRecordComplete} />
          <ReadingPreview key={refreshKey} />
        </div>

        {/* Right Column - Editor */}
        <div className="col-lg-6 mb-4">
          <div className="row mb-3">
            <div className="col-12">
              <NoteList
                onSelectNote={handleNoteSelect}
                onNewNote={handleNewNote}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Editor
                noteId={selectedNoteId || undefined}
                onSave={handleEditorSave}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
