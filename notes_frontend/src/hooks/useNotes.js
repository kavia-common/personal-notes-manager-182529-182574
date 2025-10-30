import { useCallback, useEffect, useMemo, useState } from 'react';
import { storage } from '../services/storage';

const byPinnedThenUpdated = (a, b) => {
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;
  return b.updatedAt - a.updatedAt;
};

// PUBLIC_INTERFACE
export function useNotes() {
  /**
   * Hook to manage notes lifecycle:
   * - Loads from provider (localStorage by default)
   * - Provides CRUD operations
   * - Provides search filtering
   */
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');

  // Load on mount
  useEffect(() => {
    const data = storage.listNotes();
    setNotes(data.sort(byPinnedThenUpdated));
  }, []);

  const persistAndSet = useCallback((next) => {
    const sorted = [...next].sort(byPinnedThenUpdated);
    storage.setNotes(sorted);
    setNotes(sorted);
  }, []);

  // PUBLIC_INTERFACE
  const createNote = useCallback((payload) => {
    const now = Date.now();
    const newNote = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${now}-${Math.random().toString(36).slice(2, 8)}`,
      title: payload.title || '',
      content: payload.content || '',
      updatedAt: now,
      pinned: false
    };
    const next = [newNote, ...notes];
    persistAndSet(next);
    return newNote;
  }, [notes, persistAndSet]);

  // PUBLIC_INTERFACE
  const updateNote = useCallback((id, patch) => {
    const now = Date.now();
    const next = notes.map(n => n.id === id ? { ...n, ...patch, updatedAt: now } : n);
    persistAndSet(next);
  }, [notes, persistAndSet]);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback((id) => {
    const next = notes.filter(n => n.id !== id);
    persistAndSet(next);
  }, [notes, persistAndSet]);

  // PUBLIC_INTERFACE
  const togglePin = useCallback((id) => {
    const now = Date.now();
    const next = notes.map(n => n.id === id ? { ...n, pinned: !n.pinned, updatedAt: now } : n);
    persistAndSet(next);
  }, [notes, persistAndSet]);

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, search]);

  return {
    notes,
    filteredNotes,
    search,
    setSearch,
    createNote,
    updateNote,
    deleteNote,
    togglePin
  };
}
