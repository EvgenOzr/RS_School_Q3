import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';
import type { character } from '../types/types';

const mockCharacter: character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  url: 'https://rickandmortyapi.com/api/character/1',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

describe('Card Component', () => {
  test('renders card with correct data', () => {
    render(<Card card={mockCharacter} isClosed={false} onClose={() => {}} />);

    expect(screen.getByText(/Name - Rick Sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/Status - Alive/i)).toBeInTheDocument();
    expect(screen.getByAltText('image')).toHaveAttribute(
      'src',
      mockCharacter.image
    );
  });

  test('does not render when card is null', () => {
    const { container } = render(
      <Card card={null} isClosed={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('does not render when isClosed=true', () => {
    const { container } = render(
      <Card card={mockCharacter} isClosed={true} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn(); // Vitest's mock function
    render(
      <Card card={mockCharacter} isClosed={false} onClose={mockOnClose} />
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalledOnce(); // Vitest's matcher
  });
});
