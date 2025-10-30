import React from 'react';

/**
 * Empty state with helpful call to action when there are no notes.
 */
// PUBLIC_INTERFACE
export default function EmptyState({ onCreate }) {
  /** This is a public component. */
  return (
    <section className="ocean-card" style={{ padding: 24, textAlign: 'center' }}>
      <h2 style={{ marginTop: 0 }}>No notes yet</h2>
      <p style={{ color: 'var(--ocean-muted)' }}>
        Create your first note to get started.
      </p>
      <button className="btn" onClick={onCreate} aria-label="Create your first note">Create note</button>
    </section>
  );
}
