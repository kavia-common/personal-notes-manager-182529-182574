import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';

// Reset localStorage between tests
beforeEach(() => {
  window.localStorage.clear();
});

function openCreateViaFAB() {
  const fab = screen.getByLabelText(/Create note/i);
  fireEvent.click(fab);
}

function saveInModal() {
  const save = screen.getByLabelText(/Save note/i);
  fireEvent.click(save);
}

test('can create a note', () => {
  render(<App />);
  openCreateViaFAB();

  const titleInput = screen.getByPlaceholderText(/Title/i);
  const contentInput = screen.getByPlaceholderText(/Write your note/i);

  fireEvent.change(titleInput, { target: { value: 'First' } });
  fireEvent.change(contentInput, { target: { value: 'Hello world' } });
  saveInModal();

  expect(screen.getByText('First')).toBeInTheDocument();
  expect(screen.getByText('Hello world')).toBeInTheDocument();
});

test('can edit a note', () => {
  render(<App />);
  // create
  openCreateViaFAB();
  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'EditMe' } });
  fireEvent.change(screen.getByPlaceholderText(/Write your note/i), { target: { value: 'Old content' } });
  saveInModal();

  // edit
  const editBtn = screen.getAllByLabelText(/Edit note/i)[0];
  fireEvent.click(editBtn);
  const titleInput = screen.getByPlaceholderText(/Title/i);
  fireEvent.change(titleInput, { target: { value: 'Edited' } });
  saveInModal();

  expect(screen.getByText('Edited')).toBeInTheDocument();
  expect(screen.queryByText('EditMe')).not.toBeInTheDocument();
});

test('can delete a note', () => {
  render(<App />);
  // create
  openCreateViaFAB();
  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'ToDelete' } });
  saveInModal();

  const del = screen.getByLabelText(/Delete note/i);
  fireEvent.click(del);

  expect(screen.queryByText('ToDelete')).not.toBeInTheDocument();
});

test('pinning keeps pinned notes on top', () => {
  render(<App />);
  // create A
  openCreateViaFAB();
  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'A' } });
  saveInModal();
  // create B
  openCreateViaFAB();
  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'B' } });
  saveInModal();
  // pin A
  const pinButtons = screen.getAllByLabelText(/Pin note|Unpin note/i);
  // first card currently is B (latest), pin A which is second card's first pin button
  fireEvent.click(pinButtons[1]);

  const cards = screen.getAllByRole('article');
  // First card after pin should be A
  expect(cards[0]).toHaveTextContent('A');
});

test('persists to localStorage', () => {
  // First render: create a note
  const { unmount } = render(<App />);
  openCreateViaFAB();
  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Persist' } });
  saveInModal();
  expect(screen.getByText('Persist')).toBeInTheDocument();
  unmount();

  // Second render: should load from storage
  render(<App />);
  expect(screen.getByText('Persist')).toBeInTheDocument();
});
