const KEY = 'notes_app_v1';

/**
 * Provider interface:
 * - listNotes(): Note[]
 * - createNote(note): void
 * - updateNote(id, patch): void
 * - deleteNote(id): void
 * - setNotes(notes): void
 */

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map(n => ({
      id: n.id,
      title: n.title,
      content: n.content,
      updatedAt: n.updatedAt,
      pinned: !!n.pinned
    }));
  } catch {
    return [];
  }
}

function write(notes) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(notes));
  } catch {
    // ignore write errors (e.g., storage quota)
  }
}

const localStorageProvider = {
  listNotes() {
    return read();
  },
  createNote(note) {
    const next = [note, ...read()];
    write(next);
  },
  updateNote(id, patch) {
    const next = read().map(n => n.id === id ? { ...n, ...patch } : n);
    write(next);
  },
  deleteNote(id) {
    const next = read().filter(n => n.id !== id);
    write(next);
  },
  setNotes(notes) {
    write(notes);
  }
};

let provider = localStorageProvider;

// PUBLIC_INTERFACE
export function setProvider(nextProvider) {
  /** Replace the storage provider at runtime. */
  provider = nextProvider || localStorageProvider;
}

// PUBLIC_INTERFACE
export function getProvider() {
  /** Return the current storage provider. */
  return provider;
}

// PUBLIC_INTERFACE
export const storage = {
  /** Facade delegating to current provider. */
  listNotes: () => provider.listNotes(),
  createNote: (note) => provider.createNote(note),
  updateNote: (id, patch) => provider.updateNote(id, patch),
  deleteNote: (id) => provider.deleteNote(id),
  setNotes: (notes) => provider.setNotes(notes)
};
