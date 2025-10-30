import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  render(<App />);
  const title = screen.getByText(/Ocean Notes/i);
  expect(title).toBeInTheDocument();
});

test('renders floating action button', () => {
  render(<App />);
  const fab = screen.getByLabelText(/Create note/i);
  expect(fab).toBeInTheDocument();
});
