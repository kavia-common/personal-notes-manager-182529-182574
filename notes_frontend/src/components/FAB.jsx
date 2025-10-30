import React from 'react';

/**
 * Floating Action Button for creating a new note
 */
// PUBLIC_INTERFACE
export default function FAB({ onClick, ariaLabel = 'Create' }) {
  /** This is a public component. */
  return (
    <button
      type="button"
      className="fab"
      aria-label={ariaLabel}
      onClick={onClick}
      title="Create note"
    >
      ＋
    </button>
  );
}
