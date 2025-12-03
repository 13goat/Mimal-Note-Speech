import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Essentials,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Paragraph,
  Heading,
  BlockQuote,
  Link,
  List,
  Indent,
  Alignment,
  Font,
  Table,
  TableToolbar,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageUpload,
  MediaEmbed,
  SourceEditing,
} from 'ckeditor5';
import { EditorNote } from '../types';
import { storageService } from '../utils/storage';
import 'ckeditor5/ckeditor5.css';

interface EditorProps {
  noteId?: string;
  onSave?: () => void;
}

export const Editor = ({ noteId, onSave }: EditorProps) => {
  const [editor, setEditor] = useState<ClassicEditor | null>(null);
  const [currentNote, setCurrentNote] = useState<EditorNote | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (noteId) {
      const notes = storageService.getEditorNotes();
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setCurrentNote(note);
        setTitle(note.title);
      }
    } else {
      // New note
      setCurrentNote(null);
      setTitle('');
    }
  }, [noteId]);

  const handleSave = () => {
    if (!editor) return;

    const note: EditorNote = {
      id: currentNote?.id || Date.now().toString(),
      title: title || 'เอกสารใหม่',
      content: editor.getData(),
      createdAt: currentNote?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    storageService.saveEditorNote(note);
    if (onSave) {
      onSave();
    }
    alert('บันทึกสำเร็จ!');
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">แก้ไข/จัดทำรายงาน</h5>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
          >
            <i className="bi bi-save me-1"></i>
            บันทึก
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="note-title" className="form-label">
            ชื่อเอกสาร
          </label>
          <input
            type="text"
            id="note-title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ชื่อเอกสาร"
          />
        </div>
        <div
          className="editor-wrapper"
          style={{
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            minHeight: '500px',
            position: 'relative',
          }}
        >
          <CKEditor
            editor={ClassicEditor}
            config={{
              plugins: [
                Essentials,
                Bold,
                Italic,
                Underline,
                Strikethrough,
                Code,
                Paragraph,
                Heading,
                BlockQuote,
                Link,
                List,
                Indent,
                Alignment,
                Font,
                Table,
                TableToolbar,
                Image,
                ImageToolbar,
                ImageCaption,
                ImageStyle,
                ImageUpload,
                MediaEmbed,
                SourceEditing,
              ],
              toolbar: {
                items: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'underline',
                  'strikethrough',
                  '|',
                  'fontSize',
                  'fontFamily',
                  'fontColor',
                  'fontBackgroundColor',
                  '|',
                  'alignment',
                  '|',
                  'numberedList',
                  'bulletedList',
                  '|',
                  'outdent',
                  'indent',
                  '|',
                  'link',
                  'blockQuote',
                  'insertTable',
                  'imageUpload',
                  'mediaEmbed',
                  '|',
                  'undo',
                  'redo',
                  '|',
                  'sourceEditing',
                ],
                shouldNotGroupWhenFull: true,
              },
              heading: {
                options: [
                  { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                  { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                  { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                  { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                ],
              },
              fontSize: {
                options: [9, 11, 13, 'default', 17, 19, 21, 24, 32, 36, 48],
              },
              fontFamily: {
                options: [
                  'default',
                  'Arial, Helvetica, sans-serif',
                  'Courier New, Courier, monospace',
                  'Georgia, serif',
                  'Lucida Sans Unicode, Lucida Grande, sans-serif',
                  'Tahoma, Geneva, sans-serif',
                  'Times New Roman, Times, serif',
                  'Trebuchet MS, Helvetica, sans-serif',
                  'Verdana, Geneva, sans-serif',
                ],
              },
              table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
              },
              licenseKey: 'GPL',
            }}
            data={currentNote?.content || '<p>เริ่มพิมพ์ที่นี่...</p>'}
            onReady={(editor) => {
              setEditor(editor);
              // Add line numbers styling
              const editable = editor.ui.getEditableElement();
              if (editable) {
                editable.style.lineHeight = '1.5';
                editable.style.padding = '20px 20px 20px 60px';
                editable.classList.add('line-numbered-editor');
              }
            }}
            onChange={(event, editor) => {
              // Handle change if needed
            }}
          />
        </div>
        <style>{`
          .editor-wrapper .ck-editor__editable {
            min-height: 500px;
            line-height: 1.5;
            position: relative;
            background: #fff;
          }
          
          .editor-wrapper .ck-editor__editable.line-numbered-editor {
            background-image: linear-gradient(to right, #f0f0f0 50px, transparent 50px);
            background-size: 100% 1.5em;
            background-position: 0 0;
            background-repeat: repeat-y;
            padding-left: 60px !important;
          }
          
          .editor-wrapper .ck-editor__editable.line-numbered-editor p,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h1,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h2,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h3,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h4,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h5,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h6,
          .editor-wrapper .ck-editor__editable.line-numbered-editor li {
            position: relative;
            margin: 0;
            padding-left: 0;
          }
          
          .editor-wrapper .ck-editor__editable.line-numbered-editor p::before,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h1::before,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h2::before,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h3::before,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h4::before,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h5::before,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h6::before {
            content: counter(line);
            counter-increment: line;
            position: absolute;
            left: -50px;
            width: 40px;
            text-align: right;
            color: #999;
            font-size: 0.85em;
            font-weight: normal;
            padding-right: 10px;
            user-select: none;
          }
          
          .editor-wrapper .ck-editor__editable.line-numbered-editor {
            counter-reset: line;
          }
          
          .editor-wrapper .ck-editor__editable.line-numbered-editor p,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h1,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h2,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h3,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h4,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h5,
          .editor-wrapper .ck-editor__editable.line-numbered-editor h6 {
            counter-increment: line;
          }
        `}</style>
      </div>
    </div>
  );
};

