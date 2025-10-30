# Ocean Notes - React

A lightweight notes application with a modern "Ocean Professional" theme. Create, edit, pin, delete, and search your notes. Data persists in the browser using localStorage.

## Features

- Notes CRUD with minimal UI
- Pinned notes appear first, then by recently updated
- Search across titles and content
- Accessible editor modal (role="dialog", aria-modal, ESC to close, basic focus trap)
- Floating action button (FAB) for quick note creation
- Theme toggle (light/dark) using CSS variables
- Smooth transitions while respecting prefers-reduced-motion
- Local persistence via localStorage (key: `notes_app_v1`)
- Modular architecture with a pluggable storage provider

## Run and Test

- Development: `npm start`
- Tests: `npm test`
- Build: `npm run build`

Open http://localhost:3000 after starting.

## Project Structure

- src/App.js — Application shell using components + useNotes hook
- src/styles/theme.css — Ocean Professional CSS variables and shared styles
- src/components/
  - Header.jsx — Title, search, theme toggle
  - NoteCard.jsx — Note display with pin/edit/delete
  - NoteEditorModal.jsx — Accessible modal for create/edit
  - EmptyState.jsx — Shown when there are no notes
  - FAB.jsx — Floating action button
- src/hooks/useNotes.js — Notes state + CRUD + search + sorting
- src/services/storage.js — Storage provider with default localStorage implementation
- src/__tests__/NoteFlows.test.js — Core flows (create/edit/delete/pin/persist)
- src/App.test.js — Smoke tests: header and FAB presence

## Storage Provider

The storage provider is pluggable:

Public API:
- listNotes(): Note[]
- createNote(note): void
- updateNote(id, patch): void
- deleteNote(id): void
- setNotes(notes): void

Utilities:
- setProvider(provider)
- getProvider()

Default provider uses localStorage. To swap with a backend, implement the same interface and call `setProvider(customProvider)` early in app initialization.

## Note Model

```
{
  id: string,
  title: string,
  content: string,
  updatedAt: number, // epoch ms
  pinned: boolean
}
```

Sorting order: pinned first, then by `updatedAt` descending.

## Accessibility

- Modal uses role="dialog", aria-modal="true", labelled by heading
- ESC closes the modal
- Focus is kept within the modal (basic focus trap)
- Buttons have descriptive aria-labels

## Theme

Ocean Professional palette via CSS variables (src/styles/theme.css). Theme toggle updates `data-theme` on the document element.

## Future Provider Swap Notes

- Implement a provider that matches the storage interface in `src/services/storage.js`
- Set it via `setProvider(newProvider)` prior to first render or in an initialization module
- Ensure it handles all methods and that `setNotes` updates the source of truth
