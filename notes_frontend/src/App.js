import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './styles/theme.css';
import Header from './components/Header';
import FAB from './components/FAB';
import NoteCard from './components/NoteCard';
import NoteEditorModal from './components/NoteEditorModal';
import EmptyState from './components/EmptyState';
import { useNotes } from './hooks/useNotes';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root app for the Notes application.
   * Renders the header, list of notes, floating action button, and the editor modal.
   * Applies theme and coordinates CRUD via the useNotes hook.
   */
  const { notes, filteredNotes, search, setSearch, createNote, updateNote, deleteNote, togglePin } = useNotes();
  const [isModalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState({ id: null, title: '', content: '' });
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const openForCreate = () => {
    setDraft({ id: null, title: '', content: '' });
    setModalOpen(true);
  };

  const openForEdit = (note) => {
    setDraft({ id: note.id, title: note.title, content: note.content });
    setModalOpen(true);
  };

  const onSave = () => {
    const trimmedTitle = draft.title.trim();
    const trimmedContent = draft.content.trim();
    if (!trimmedTitle && !trimmedContent) {
      setModalOpen(false);
      return;
    }
    if (draft.id) {
      updateNote(draft.id, { title: trimmedTitle, content: trimmedContent });
    } else {
      createNote({ title: trimmedTitle, content: trimmedContent });
    }
    setModalOpen(false);
  };

  const notesList = useMemo(() => filteredNotes, [filteredNotes]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App ocean-app">
      <Header
        title="Ocean Notes"
        search={search}
        onSearchChange={setSearch}
        onToggleTheme={toggleTheme}
        theme={theme}
      />
      <main className="container">
        {notesList.length === 0 ? (
          <EmptyState onCreate={openForCreate} />
        ) : (
          <div className="notes-grid" aria-live="polite">
            {notesList.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => openForEdit(note)}
                onDelete={() => deleteNote(note.id)}
                onPin={() => togglePin(note.id)}
              />
            ))}
          </div>
        )}
      </main>
      <FAB onClick={openForCreate} ariaLabel="Create note" />
      <NoteEditorModal
        isOpen={isModalOpen}
        title={draft.title}
        content={draft.content}
        onTitleChange={(t) => setDraft((d) => ({ ...d, title: t }))}
        onContentChange={(c) => setDraft((d) => ({ ...d, content: c }))}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
      />
    </div>
  );
}

export default App;
