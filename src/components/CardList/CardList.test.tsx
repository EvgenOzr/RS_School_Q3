import { render, screen, fireEvent } from '@testing-library/react';
import CardList from './CardList';
import { describe, it, expect, vi } from 'vitest';

describe('CardList Component', () => {
  const mockData = [
    {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      url: 'https://swapi.py4e.com/api/people/1/',
    },
    {
      name: 'Leia Organa',
      height: '150',
      mass: '49',
      hair_color: 'brown',
      skin_color: 'light',
      eye_color: 'brown',
      birth_year: '19BBY',
      gender: 'female',
      url: 'https://swapi.py4e.com/api/people/5/',
    },
  ];

  it('renders list of characters', () => {
    const mockOnItemSelected = vi.fn();
    render(<CardList data={mockData} onItemSelected={mockOnItemSelected} />);

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Leia Organa')).toBeInTheDocument();
  });

  it('calls onItemSelected when item clicked', () => {
    const mockOnItemSelected = vi.fn();
    render(<CardList data={mockData} onItemSelected={mockOnItemSelected} />);

    fireEvent.click(screen.getByText('Luke Skywalker'));
    expect(mockOnItemSelected).toHaveBeenCalledWith(mockData[0]);
  });
});
