import React from 'react';

/**
 * Card for rendering a single note with actions.
 * Includes pin, edit, and delete with aria-labels.
 */
// PUBLIC_INTERFACE
export default function NoteCard({ note, onEdit, onDelete, onPin }) {
  /** This is a public component. */
  return (
    <article className="ocean-card" style={{ padding: 14, position: 'relative' }} aria-label={`Note: ${note.title || 'Untitled'}`}>
      <div style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '2px 0 8px', fontSize: 18 }}>{note.title || 'Untitled'}</h2>
          <p style={{ margin: 0, color: 'var(--ocean-muted)', whiteSpace: 'pre-wrap' }}>
            {note.content || 'No content'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="btn ghost"
            onClick={onPin}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            {note.pinned ? '📌' : '📍'}
          </button>
          <button className="btn ghost" onClick={onEdit} aria-label="Edit note" title="Edit">✏️</button>
          <button className="btn ghost" onClick={onDelete} aria-label="Delete note" title="Delete">🗑️</button>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ocean-muted)' }}>
        Updated {new Date(note.updatedAt).toLocaleString()}
      </div>
      {note.pinned && (
        <div aria-hidden="true" title="Pinned"
          style={{
            position: 'absolute', top: 10, left: 10, width: 8, height: 8, borderRadius: 999,
            background: 'var(--ocean-secondary)'
          }}
        />
      )}
    </article>
  );
}
