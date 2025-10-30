import React, { useEffect, useRef } from 'react';

/**
 * Accessible modal for creating or editing a note.
 * - role="dialog", aria-modal, labelled by heading
 * - basic focus trap and ESC to close
 */
// PUBLIC_INTERFACE
export default function NoteEditorModal({
  isOpen,
  title,
  content,
  onTitleChange,
  onContentChange,
  onClose,
  onSave
}) {
  /** This is a public component. */
  const dialogRef = useRef(null);
  const firstFocusable = useRef(null);
  const lastFocusable = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const focusables = dialog.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusables.length) {
      firstFocusable.current = focusables[0];
      lastFocusable.current = focusables[focusables.length - 1];
      firstFocusable.current.focus();
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab') {
        // Basic focus trap
        if (e.shiftKey && document.activeElement === firstFocusable.current) {
          e.preventDefault();
          lastFocusable.current?.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable.current) {
          e.preventDefault();
          firstFocusable.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50
      }}
      aria-hidden={false}
      onMouseDown={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-editor-title"
        className="ocean-card"
        style={{ width: 'min(720px, 96vw)', padding: 16 }}
      >
        <h2 id="note-editor-title" style={{ marginTop: 4, marginBottom: 12 }}>
          {title ? 'Edit note' : 'New note'}
        </h2>
        <div style={{ display: 'grid', gap: 10 }}>
          <label htmlFor="note-title" className="visually-hidden">Title</label>
          <input
            id="note-title"
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          <label htmlFor="note-content" className="visually-hidden">Content</label>
          <textarea
            id="note-content"
            className="textarea"
            placeholder="Write your note..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
          <button className="btn ghost" onClick={onClose} aria-label="Cancel">Cancel</button>
          <button className="btn" onClick={onSave} aria-label="Save note">Save</button>
        </div>
      </div>
    </div>
  );
}
