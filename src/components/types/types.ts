import type { ReactNode } from 'react';

type searchProps = {
  onUpdateSearch: (search: string) => void;
};

export interface swcharacter {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  birth_year: string;
  eye_color: string;
  gender?: string;
  url: string;
}

export interface appState {
  data: swcharacter[];
  itemSelected: swcharacter | null;
  hasError: boolean;
  noResults: boolean;
  loading: boolean;
  apiBase: string;
}

export interface rowProps {
  left: ReactNode;
  right: ReactNode;
}

type cardListProps = {
  data: swcharacter[];
  onItemSelected: (item: swcharacter) => void;
};

export interface cardProps {
  card: swcharacter;
}
export interface messageProps {
  title: string;
  text: string;
}

export type { searchProps, cardListProps };
