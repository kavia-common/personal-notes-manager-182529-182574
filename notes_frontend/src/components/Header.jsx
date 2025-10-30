import React from 'react';

/**
 * Header with app title, search field, and theme toggle
 * Accessible labels and roles are included for better UX.
 */
// PUBLIC_INTERFACE
export default function Header({ title, search, onSearchChange, onToggleTheme, theme }) {
  /** This is a public component. */
  return (
    <header className="header">
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 16, paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            aria-hidden="true"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--ocean-primary), var(--ocean-secondary))',
              boxShadow: 'var(--ocean-shadow-sm)'
            }}
          />
          <h1 style={{ margin: 0, fontSize: 22 }}>{title}</h1>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, width: 'min(420px, 60vw)' }}>
          <label htmlFor="search" className="visually-hidden">Search notes</label>
          <input
            id="search"
            className="input"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search notes"
          />
          <button
            type="button"
            className="btn ghost"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
}
