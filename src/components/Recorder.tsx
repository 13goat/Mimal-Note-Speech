import { useState, useRef } from 'react';
import { storageService } from '../utils/storage';
import { NoteItem } from '../types';

interface RecorderProps {
  onRecordComplete: () => void;
}

export const Recorder = ({ onRecordComplete }: RecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const note: NoteItem = {
          id: Date.now().toString(),
          content: transcript || 'Recording without transcript',
          timestamp: new Date(),
          audioUrl,
        };

        storageService.addRecording(note);
        onRecordComplete();
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop());
        setTranscript('');
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาตรวจสอบการตั้งค่า');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="card mb-4">
      <h5 className="card-header">บันทึกเสียง</h5>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="transcript" className="form-label">
            ข้อความ (ถ้ามี)
          </label>
          <textarea
            id="transcript"
            className="form-control"
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="พิมพ์ข้อความที่บันทึก (ถ้ามี)"
            disabled={isRecording}
          />
        </div>
        <div className="d-flex gap-2">
          {!isRecording ? (
            <button
              className="btn btn-danger"
              onClick={startRecording}
            >
              <i className="bi bi-record-circle me-2"></i>
              เริ่มบันทึก
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={stopRecording}
            >
              <i className="bi bi-stop-circle me-2"></i>
              หยุดบันทึก
            </button>
          )}
        </div>
        {isRecording && (
          <div className="mt-3">
            <div className="spinner-border spinner-border-sm text-danger me-2" role="status">
              <span className="visually-hidden">กำลังบันทึก...</span>
            </div>
            <span className="text-danger">กำลังบันทึก...</span>
          </div>
        )}
      </div>
    </div>
  );
};

