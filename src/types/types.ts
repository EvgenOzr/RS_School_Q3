import type { ReactNode } from 'react';

type searchProps = {
  onUpdateSearch: (search: string, url?: string) => void;
};

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  url: string;
}

export interface appState {
  data: character[];
  count: number;
  previous: string | null;
  next: string | null;
  itemSelected: character | null;
  noResults: boolean;
  loading: boolean;
}

export interface rowProps {
  left: ReactNode;
  right: ReactNode;
}

type cardListProps = {
  data: character[];
  onItemSelected: (item: character) => void;
};

export interface cardProps {
  card: character | null;
  isClosed: boolean;
  onClose: () => void;
}
export interface messageProps {
  title: string;
  text: string;
}

export type { searchProps, cardListProps };
