import { render, screen } from '@testing-library/react';
import Card from './Card';
import { describe, it, expect } from 'vitest';

describe('Card Component', () => {
  const mockCharacter = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    url: 'https://swapi.py4e.com/api/people/1/',
  };

  it('has correct DOM structure', () => {
    render(<Card card={mockCharacter} />);
    expect(document.querySelector('.item')).toBeInTheDocument();
    expect(document.querySelectorAll('.item_field')).toHaveLength(6);
  });

  it('renders character details correctly', () => {
    render(<Card card={mockCharacter} />);

    expect(
      screen.getByText(`Name - ${mockCharacter.name}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Birth year - ${mockCharacter.birth_year}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Height - ${mockCharacter.height}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Gender - ${mockCharacter.gender}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Eye color - ${mockCharacter.eye_color}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Mass - ${mockCharacter.mass}`)
    ).toBeInTheDocument();
  });

  it('renders all fields even with empty values', () => {
    const emptyCharacter = {
      name: 'Unknown',
      height: '',
      mass: '',
      hair_color: '',
      skin_color: '',
      eye_color: '',
      birth_year: '',
      gender: '',
      url: '',
    };

    render(<Card card={emptyCharacter} />);

    expect(screen.getByText('Name - Unknown')).toBeInTheDocument();
    expect(screen.getByText(/Birth year -/i)).toBeInTheDocument();
    expect(screen.getByText(/Height -/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender -/i)).toBeInTheDocument();
    expect(screen.getByText(/Birth year -/i)).toHaveClass('item_field');
  });
});
