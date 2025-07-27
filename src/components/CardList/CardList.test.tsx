import { render, screen, fireEvent } from '@testing-library/react';
import CardList from './CardList';
import { describe, it, expect, vi } from 'vitest';

describe('CardList Component', () => {
  const mockData = [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      url: 'https://rickandmortyapi.com/api/character/1',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      url: 'https://rickandmortyapi.com/api/character/2',
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    },
  ];

  it('renders list of characters', () => {
    const mockOnItemSelected = vi.fn();
    render(<CardList data={mockData} onItemSelected={mockOnItemSelected} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('calls onItemSelected when item clicked', () => {
    const mockOnItemSelected = vi.fn();
    render(<CardList data={mockData} onItemSelected={mockOnItemSelected} />);

    fireEvent.click(screen.getByText('Rick Sanchez'));
    expect(mockOnItemSelected).toHaveBeenCalledWith(mockData[0]);
  });
});
